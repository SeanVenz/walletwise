import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import "./ChatModal.scss";
import close from "../../images/close.png";
import sendMessagePic from "../../images/send-message.png";
import { compose } from "redux";
import Spinner from "../Spinner/Spiner";
import MapboxMarker from "components/Mapbox/MapBoxMarker";

function ChatModal({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatRef, setChatRef] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [recipient, setRecipient] = useState();
  const [currentUser, setSender] = useState();
  const [chatroom, setChatRoomId] = useState();
  const [ordererName, setOrdererName] = useState();
  const [courierName, setCourierName] = useState();
  const [senderPhoneNumber, setSenderPhoneNumber] = useState();
  const [senderIdNumber, setSenderIdNumber] = useState();
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState();
  const [recipientIdNumber, setRecipientIdNumber] = useState();
  const [orderReceived, setOrderReceived] = useState();
  const [deliveryReceived, setDeliveryReceived] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [showOrdererLocation, setShowOrdererLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const toggleMapModal = () => {
    setShowMapModal(!showMapModal);
  };

  const addDeliveryHistory = async (uid, orderId) => {
    const userCollectionRef = collection(db, "users", uid, "deliveries");
    await addDoc(userCollectionRef, {
      OrderId: orderId,
    });
  };

  const addOrderHistory = async (uid, orderId) => {
    const userCollectionRef = collection(db, "users", uid, "orders");
    await addDoc(userCollectionRef, {
      OrderId: orderId,
    });
  };

  const getChatRooms = async () => {
    const chatRoomCollection = collection(db, "chatrooms");
    const chatRoomSnapshot = await getDocs(chatRoomCollection);
    return chatRoomSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };

  useEffect(() => {
    setIsLoading(false);
    const fetchRoomData = async () => {
      try {
        const user = auth.currentUser.uid;
        const roomData = await getChatRooms();
        for (var i = 0; i < roomData.length; i++) {
          if (user === roomData[i].recipient || user === roomData[i].sender) {
            setSender(roomData[i].sender);
            setRecipient(roomData[i].recipient);
            setChatRoomId(roomData[i].id);
            setOrdererName(roomData[i].ordererName);
            setCourierName(roomData[i].courierName);
          }
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setIsLoading(false);
      }
    };

    fetchRoomData();

    const getInfo = async () => {
      try {
        const senderRef = doc(db, "users", currentUser);
        const senderData = await getDoc(senderRef);

        if (senderData.exists()) {
          setSenderPhoneNumber(senderData.data().phoneNumber);
          setSenderIdNumber(senderData.data().idNumber);
        }

        const recipientRef = doc(db, "users", recipient);
        const recepientData = await getDoc(recipientRef);

        if (recepientData.exists()) {
          setRecipientPhoneNumber(recepientData.data().phoneNumber);
          setRecipientIdNumber(recepientData.data().idNumber);
        }
      } catch (error) {
        console.log("There's an error", error);
      }
    };

    getInfo();
  }, [currentUser, recipient]);

  const getChatroomRef = () => {
    // Ensure both sender and recipient are defined before constructing the chatroom reference
    if (currentUser && recipient) {
      const chatroomID = [currentUser, recipient].sort().join("_");
      return doc(db, "chatrooms", chatroomID);
    }
    return null;
  };

  const getParticipants = async () => {
    try {
      const chatroomRef = getChatroomRef();

      if (chatroomRef) {
        const chatroomDoc = await doc(chatroomRef).get();

        if (chatroomDoc.exists()) {
          const data = chatroomDoc.data();
          const chatParticipants = [data.sender, data.recipient];
          setParticipants(chatParticipants);
        }
      }
    } catch (error) {
      console.error("Error fetching chat participants:", error);
    }
  };

  const checkReceivedAndDelivered = async () => {
    try {
      const info = getChatroomRef();
      const docSnapshot = await getDoc(info);
      const docData = docSnapshot.data();

      docData.orderIsAccepted === true
        ? setOrderReceived(true)
        : setOrderReceived(false);
      docData.orderIsDelivered === true
        ? setDeliveryReceived(true)
        : setDeliveryReceived(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      await getParticipants();
    };

    checkReceivedAndDelivered();

    fetchParticipants();

    if (recipient && currentUser && chatroom) {
      const chatroomRef = getChatroomRef();

      if (chatroomRef) {
        const chatMessagesRef = collection(chatroomRef, "messages");

        const unsubscribe = onSnapshot(
          query(chatMessagesRef, orderBy("timestamp")),
          (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data());
            setChatMessages(messagesData);
          }
        );

        setChatRef(chatMessagesRef);

        return () => {
          unsubscribe();
        };
      }
    }
  }, [recipient, currentUser, chatroom]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message && chatroom) {
      const newMessage = {
        sender:
          auth.currentUser.uid === currentUser ? courierName : ordererName,
        text: message,
        timestamp: new Date(),
      };

      try {
        const chatroomRef = getChatroomRef();

        if (chatroomRef) {
          // Add the new message to the subcollection
          await addDoc(collection(chatroomRef, "messages"), newMessage);

          // Update the last message timestamp in the chatroom document
          await updateDoc(chatroomRef, {
            lastMessage: newMessage.text,
            lastMessageTimestamp: newMessage.timestamp,
          });

          setMessage("");
        }
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const updateHasCurrentDelivery = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid);
      return await updateDoc(userInfoRef, { hasPendingDelivery: false });
    } catch (error) {
      console.log(error);
    }
  };

  const updateHasCurrentOrder = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid);
      return await updateDoc(userInfoRef, { hasPendingOrder: false });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessagesRef = async () => {
    const chatRoomRef = getChatroomRef();
    const messageCollectionRef = collection(chatRoomRef, "messages");
    const messageQuerySnapshot = await getDocs(messageCollectionRef);

    messageQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  const deleteChatroomAndClose = async () => {
    try {
      const info = getChatroomRef();
      const docSnapshot = await getDoc(info);
      const docData = docSnapshot.data();
      const orderId = docData.orderId;
      const orderInfo = await doc(db, "orders", orderId);
      const orderData = await getDoc(orderInfo);
      const data = orderData.data();
      if (
        docData.orderIsAccepted === true &&
        docData.orderIsDelivered === true
      ) {
        const deliveryHistoryCollectionRef = doc(db, "orders-history", orderId);

        await setDoc(deliveryHistoryCollectionRef, {
          ...data,
          courierName: courierName,
          courierId: currentUser,
          courierIdNumber: senderIdNumber,
          recipientIdNumber: recipientIdNumber,
          courierPhoneNumber: senderPhoneNumber,
        });

        addDeliveryHistory(currentUser, orderId);
        addOrderHistory(recipient, orderId);
        await deleteDoc(orderInfo);
        await deleteDoc(info);
        await deleteMessagesRef();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrderAccepted = async () => {
    checkReceivedAndDelivered();
    updateHasCurrentOrder(recipient);
    const chatRoomRef = getChatroomRef();
    await updateDoc(chatRoomRef, { orderIsAccepted: true });
    await deleteChatroomAndClose();
    onClose();
  };

  const handleOrderDelivered = async () => {
    checkReceivedAndDelivered();
    updateHasCurrentDelivery(currentUser);
    const chatRoomRef = getChatroomRef();
    await deleteChatroomAndClose();
    await updateDoc(chatRoomRef, { orderIsDelivered: true });
    await deleteChatroomAndClose();
    onClose();
  };

  const handleOpenOrdererLocation = async () => {
    try {
      const info = getChatroomRef();
      const docSnapshot = await getDoc(info);
      const docData = docSnapshot.data();
      const orderId = docData.orderId;

      // Get the order information using the orderId
      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);

      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.data();
        const longitude = orderData.longitude;
        const latitude = orderData.latitude;
        setLongitude(longitude);
        setLatitude(latitude);

        // Show the orderer location modal
        setShowMapModal(true);
      } else {
        console.log("Order not found");
      }
    } catch (error) {
      console.error("Error getting order information:", error);
    }
  };

  return (
    <div className={`chat-modal ${isOpen ? "open" : "closed"}`}>
      <div className="chat-modal-content">
        {isLoading ? (
          <Spinner></Spinner>
        ) : (
          <>
            <div className="chat-header-data">
              {auth.currentUser.uid === recipient ? (
                <>
                  <h3
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  >
                    {" "}
                    {courierName}
                  </h3>
                  <img
                    className="close-chat"
                    onClick={onClose}
                    alt="close"
                    src={close}
                  ></img>
                </>
              ) : null}
            </div>

            <div className="chat-header">
              {auth.currentUser.uid === recipient ? (
                <>
                  <h3
                    className="chat-content"
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  >
                    Phone Number: {senderPhoneNumber}
                  </h3>
                  <h3
                    className="chat-content"
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  >
                    ID Number: {senderIdNumber}
                  </h3>
                  {deliveryReceived === true ? (
                    <p className="chat-received">
                      Courier confirmed its delivered
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="chat-header-other">
                    <h3
                      style={{
                        marginTop: "0px",
                        marginBottom: "0px",
                      }}
                    >
                      {ordererName}
                    </h3>
                    <img
                      className="close-chat-other"
                      onClick={onClose}
                      alt="close"
                      src={close}
                    ></img>
                  </div>
                  <h3
                    className="chat-content"
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  >
                    Phone Number: {recipientPhoneNumber}
                  </h3>
                  <h3
                    className="chat-content"
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  >
                    ID Number: {recipientIdNumber}
                  </h3>
                  <div className="order-accepted-parent">
                    <button
                      className="order-accepted"
                      onClick={handleOpenOrdererLocation}
                    >
                      Open Orderer Location
                    </button>
                    <div className="chat-received-parent">
                      {orderReceived === true ? (
                        <p className="chat-received">
                          Buyer confirmed order is received
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {showMapModal && (
                    <div className="map-modal">
                      <MapboxMarker latitude={latitude} longitude={longitude} />
                      <button
                        className="close-map-modal"
                        onClick={() => setShowMapModal(false)}
                      >
                        Close Map
                      </button>
                    </div>
                  )}
                </>
              )}
              {auth.currentUser.uid === recipient ? (
                <>
                  {orderReceived === true ? (
                    <p className="order-received-message">
                      Waiting for confirmation from courier
                    </p>
                  ) : (
                    <div className="order-accepted-parent">
                      <button
                        className="order-accepted"
                        onClick={handleOrderAccepted}
                      >
                        Order Accepted
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {deliveryReceived === true ? (
                    <p className="delivery-success-message">
                      Waiting for confirmation from orderer
                    </p>
                  ) : (
                    <div className="order-delivered-parent">
                      <button
                        className="order-delivered"
                        onClick={handleOrderDelivered}
                      >
                        Order Delivered
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className="message">
                  {auth.currentUser.displayName === message.sender ? (
                    <>
                      <div className="sender">
                        <p
                          className="message-text"
                          style={{
                            marginTop: "0px",
                            marginBottom: "0px",
                          }}
                        >
                          {message.text}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="recipient">
                        <p
                          className="message-text"
                          style={{
                            marginTop: "0px",
                            marginBottom: "0px",
                          }}
                        >
                          {message.text}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <form>
                <div className="textarea-container">
                  <textarea
                    type="text"
                    placeholder="Start a conversation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="send-message-container">
                  <img
                    type
                    src={sendMessagePic}
                    alt="send"
                    onClick={(e) => sendMessage(e)}
                  />
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatModal;
