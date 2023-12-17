import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase"; // Import your Firebase configuration
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ChatModal from "../../components/ChatModal/ChatModal";
import authService from "../../utils/auth";
import "./Delivery.scss";
import {
  calculatePerPersonTotal,
  formatTimestamp,
  groupItemsByStore,
  handleCancelOrder,
} from "utils/utils";

function StudentDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isChatOpen, setChatOpen] = useState(false);
  const [sender, setSender] = useState();
  const [recipient, setRecipient] = useState();
  const [ordererName, setOrdererName] = useState();
  const [hasCurrentDelivery, setHasCurrentDelivery] = useState(false);
  const [hasCurrentOrder, setHasCurrentOrder] = useState(false);
  const [isLocationWithinCIT, setIsLocationWithinCIT] = useState(true); // New state variable for location check

  // Define CIT square coordinates
  const upperLeftLongitude = 123.87584793126894;
  const upperLeftLatitude = 10.29833910570575;
  const lowerLeftLongitude = 123.87776249843915;
  const lowerLeftLatitude = 10.290490158405248;
  const upperRightLongitude = 123.88281891942336;
  const upperRightLatitude = 10.299401717404876;
  const lowerRightLongitude = 123.8838989316709;
  const lowerRightLatitude = 10.294112773733147;

  const openChat = async () => {
    setChatOpen(true);
  };

  useEffect(() => {
    // Reference to the "deliveries" collection
    const deliveryCollectionRef = collection(db, "orders");

    // Query the collection and listen for changes
    const unsubscribe = onSnapshot(deliveryCollectionRef, (snapshot) => {
      const deliveryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeliveries(deliveryData);
    });

    return () => {
      // Unsubscribe from the Firestore listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const checkHasCurrentOrder = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid);
      const userInfoSnapshot = await getDoc(userInfoRef);
      return userInfoSnapshot.data().hasPendingOrder === true;
    } catch (error) {
      console.error("Error checking current order:", error);
      return false;
    }
  };

  const addHasCurrentDelivery = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid);
      await updateDoc(userInfoRef, {
        hasPendingDelivery: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkHasCurrentDelivery = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid);
      const userInfoSnapshot = await getDoc(userInfoRef);
      return userInfoSnapshot.data().hasPendingDelivery === true;
    } catch (error) {
      console.log(error);
    }
  };

  const getChatRooms = async () => {
    const chatCollection = collection(db, "chatrooms");
    const chatSnapshot = await getDocs(chatCollection);
    return chatSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };

  // when handlebutton clicked
  const fetchRoomData = async () => {
    try {
      const user = auth.currentUser.uid;
      setCurrentUser(user);
      const roomData = await getChatRooms();
      for (var i = 0; i < roomData.length; i++) {
        if (user === roomData[i].recipient || user === roomData[i].sender) {
          setSender(roomData[i].sender);
          setRecipient(roomData[i].recipient);
        }
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // check if their convo is already existing
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const user = auth.currentUser.uid;
        setCurrentUser(user);
        const roomData = await getChatRooms();
        for (var i = 0; i < roomData.length; i++) {
          if (user === roomData[i].recipient || user === roomData[i].sender) {
            setSender(roomData[i].sender);
            setRecipient(roomData[i].recipient);
          }
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRoomData();
  }, []);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const roomData = await getChatRooms();
      } catch (error) {
        console.error("Error fetching all foods:", error);
      }
    };

    fetchChatRooms();
  }, []);

  const getChatroomRef = (senderUID, recipientUID) => {
    const chatRoomID = [senderUID, recipientUID].sort().join("_");
    return doc(db, "chatrooms", chatRoomID);
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Permission granted, update the state with latitude and longitude
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Check if the location is within CIT square
          const isWithinCIT =
            longitude >= lowerLeftLongitude &&
            longitude <= lowerRightLongitude &&
            latitude >= lowerLeftLatitude &&
            latitude <= upperLeftLatitude;

          setIsLocationWithinCIT(isWithinCIT);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  const clickOrderAccept = async (orderId, recipientId, ordererName) => {
    handleUseCurrentLocation();
    handleOrderAccepted(orderId, recipientId, ordererName);
  };

  const handleOrderAccepted = async (orderId, recipientId, ordererName) => {
    try {
      const user = authService.getCurrentUser();
      const hasCurrentDelivery = await checkHasCurrentDelivery(user.uid);
      const hasCurrentOrder = await checkHasCurrentOrder(user.uid);
      setHasCurrentDelivery(hasCurrentDelivery);
      setHasCurrentOrder(hasCurrentOrder);

      if (!hasCurrentDelivery && !hasCurrentOrder) {
        setOrdererName(ordererName);

        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { isOrderAccepted: true });

        const senderUID = auth.currentUser.uid;
        const courierName = auth.currentUser.displayName;
        const chatroomRef = getChatroomRef(senderUID, recipientId);

        addHasCurrentDelivery(senderUID);

        await setDoc(chatroomRef, {
          sender: senderUID,
          recipient: recipientId,
          ordererName: ordererName,
          courierName: courierName,
          orderId: orderId,
        });
        fetchRoomData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render the "Accept Order" button based on location and other conditions
  const renderAcceptOrderButton = (delivery) => {
    // if (isLocationWithinCIT) {
      if (currentUser === delivery.userId) {
        if (delivery.isOrderAccepted) {
          return (
            <div className="chat-container">
              <button
                className="chat"
                onClick={() => openChat(delivery.userId)}
              >
                Chat
              </button>
            </div>
          );
        } else {
          return (
            <div className="order-not-accepted">
              <button
                className="cancel-order"
                onClick={() => handleCancelOrder(delivery.userId, delivery.id)}
              >
                Cancel Order
              </button>
            </div>
          );
        }
      } else {
        if (!delivery.isOrderAccepted) {
          if (hasCurrentDelivery || hasCurrentOrder) {
            return (
              <p className="order-not-accepted">
                Finish your current transaction first
              </p>
            );
          } else {
            return (
              <div className="accept-order-parent">
                <button
                  className="accept-order"
                  onClick={() =>
                    clickOrderAccept(
                      delivery.id,
                      delivery.userId,
                      delivery.userName
                    )
                  }
                >
                  Accept Order
                </button>
              </div>
            );
          }
        } else {
          if (currentUser === sender) {
            return (
              <div className="chat-container">
                <button className="chat" onClick={() => openChat(delivery.userId)}>
                  Chat
                </button>
              </div>
            );
          } else {
            return (
              <p className="order-not-accepted">Order is already accepted</p>
            );
          }
        }
      }
    // }
    //  else {
    //   return <p className="order-not-accepted">Location is not within CIT</p>;
    // }
  };

  return (
    <div className="orders-student-delivery">
      <h2 className="orders-header">Orders</h2>
      <ul className="order-parent">
        {deliveries.map((delivery) => (
          <li key={delivery.id} className="order-card">
            <h3 className="text"> {delivery.userName}</h3>
            <p className="text">ID Number: {delivery.idNumber}</p>
            <p className="text">Phone Number: {delivery.phoneNumber}</p>
            <p className="text">Time: {formatTimestamp(delivery.timestamp)}</p>
            <h4>Order Summary:</h4>
            <div className="scrollable-list">
              {Array.from(groupItemsByStore(delivery.items)).map(
                ([storeName, storeItems], index) => (
                  <div key={index} className="ul-holder">
                    <p className="store-name">{storeName}</p>
                    <ul>
                      {storeItems.map((item, itemIndex) => (
                        <div className="order-list" key={itemIndex}>
                          <li>
                            {item.itemName} ({item.quantity}) ₱
                            {item.totalPrice.toFixed(2)}
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            <p className="total">
              Total: ₱{calculatePerPersonTotal(delivery.items).toFixed(2)}
            </p>
            {renderAcceptOrderButton(delivery, currentUser, delivery.userId)}
          </li>
        ))}
      </ul>
      {isChatOpen && (
        <ChatModal isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );  
}

export default StudentDelivery;
