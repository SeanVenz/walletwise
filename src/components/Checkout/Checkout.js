import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import {
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import authService from "../../utils/auth";
import { calculatePerPersonTotal } from "utils/utils";
import "./Checkout.scss";
import bottomLogo from "../../images/bottom-logo.png";

function Checkout({
  cartItems,
  fullName,
  idNumber,
  phoneNumber,
  foodId,
  number,
  quantity,
}) {
  const [showModal, setShowModal] = useState(false);
  const [hasOrder, setHasOrder] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [total, setTotal] = useState();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleUseCurrentLocation = () => {
    setIsGetting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Permission granted, update the state with latitude and longitude
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationPermissionGranted(true);
          setIsGetting(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationPermissionGranted(false);
          setIsGetting(false);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
      setLocationPermissionGranted(false);
      setIsGetting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const updateFoodQuantity = async () => {
    try {
      // Iterate through the arrays of foodId, number, and quantity
      for (let i = 0; i < foodId.length; i++) {
        const food = foodId[i];
        const itemNumber = number[i];
        const itemQuantity = quantity[i];

        const foodItemRef = doc(db, "food", food);
        const newQuantity = itemNumber - itemQuantity;

        const foodRefSnapshot = await getDoc(foodItemRef);

        if (foodRefSnapshot.exists()) {
          // Update the quantity in Firestore
          await updateDoc(foodItemRef, {
            Quantity: newQuantity,
          });
        }
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
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

  const deleteCartItems = async (userId) => {
    try {
      const cartItemsCollectionRef = collection(db, "carts", userId, "items");
      const cartItemsQuery = query(cartItemsCollectionRef);
      const cartItemsSnapshot = await getDocs(cartItemsQuery);

      // Delete each cart item
      cartItemsSnapshot.forEach(async (itemDoc) => {
        const itemId = itemDoc.id;
        const cartItemRef = doc(db, "carts", userId, "items", itemId);
        await deleteDoc(cartItemRef);
      });
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  };

  const addHasCurrentOrder = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid); // Get a reference to the document
      await updateDoc(userInfoRef, {
        hasPendingOrder: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkHasCurrentOrder = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid); // Get a reference to the document
      const userInfoSnapshot = await getDoc(userInfoRef);
      return userInfoSnapshot.data().hasPendingOrder === true;
    } catch (error) {
      console.error("Error checking current order:", error);
      return false;
    }
  };

  useEffect(() => {
    setTotal(calculatePerPersonTotal(cartItems).toFixed(2));
  });

  const handleCheckout = async () => {
    try {
      const user = authService.getCurrentUser();
      const hasCurrentOrder = await checkHasCurrentOrder(user.uid);
      const hasCurrentDelivery = await checkHasCurrentDelivery(user.uid);
      setHasOrder(hasCurrentOrder); // Update the state with the result
      setHasDelivery(hasCurrentDelivery);
      if (user && !hasCurrentOrder && !hasCurrentDelivery) {
        const userId = user.uid;

        const deliveryCollectionRef = collection(db, "orders");

        const itemsToCheckout = cartItems.map((item) => ({
          itemName: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          storeName: item.storeName,
        }));

        // Create a delivery document with user information and items
        await addDoc(deliveryCollectionRef, {
          userId: userId,
          userName: fullName,
          idNumber: idNumber,
          phoneNumber: phoneNumber,
          items: itemsToCheckout,
          timestamp: Date.now(),
          latitude: latitude,
          longitude: longitude,
        });

        addHasCurrentOrder(userId);

        // Delete cart items
        deleteCartItems(userId);

        // Close the modal
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="checkout">
      <div className="img-holder">
        <img src={bottomLogo} alt="logo" />
      </div>
      <div className="checkout-button">
        <div className="total">
          {cartItems && cartItems.length > 0 ? (
            <>
              <p>Total : ₱{total}</p>
              <button
                onClick={handleOpenModal}
                disabled={hasOrder || hasDelivery}
              >
                {isLoading ? "Loading..." : "Check Out"}
              </button>
            </>
          ) : (
            <p>No Orders Yet</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="checkout-modal">
          <div className="checkout-modal-content">
            {!locationPermissionGranted ? (
              <>
                <p className="confirmation">
                  Do you want to use your current location as the delivery
                  destination?
                </p>
                <div className="first-questions">
                  {isGetting ? (
                    "Getting Current Location"
                  ) : (
                    <button onClick={handleUseCurrentLocation}>Confirm</button>
                  )}

                  <button onClick={handleCloseModal}>No</button>
                </div>
              </>
            ) : (
              <>
                <h2>Confirm Checkout</h2>
                {hasOrder || hasDelivery ? (
                  <p className="error">Finish your current transaction first</p>
                ) : null}
                <div className="first-questions">
                  <button onClick={handleCheckout} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Confirm"}
                  </button>
                  <button onClick={handleCloseModal}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
