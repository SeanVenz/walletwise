// OrderModal.js
import React from "react";
import "./OrderModal.scss";
import { auth } from "utils/firebase";
import { calculatePerPersonTotal } from "utils/utils";

const OrderModal = ({ orderData, onClose }) => {
  return (
    <div className="order-modal">
      <div className="order-modal-content">
        <button className="order-close-button" onClick={onClose}>
          Close
        </button>
        <h2>ORDER SUMMARY:</h2>
        <div className="order-data">
          {auth.currentUser.uid === orderData.userId ? (
            <div className="name">
              <p>Courier Name: {orderData.courierName}</p>
              <p>ID Number: {orderData.courierIdNumber}</p>
            </div>
          ) : (
            <div className="name">
              <p>Buyer Name: {orderData.userName}</p>
              <p>ID Number: {orderData.recipientIdNumber}</p>
            </div>
          )}

          <div className="foods">
            {orderData.items && orderData.items.length > 0 && (
              <>
                <div className="food-heading">
                  <h3>ORDER SUBTOTAL:</h3>
                </div>
                <div className="scrollable">
                  <ul>
                    {orderData.items.map((item, index) => (
                      <>
                        <div className="deets" key={index}>
                          <li key={index}>
                            <p>{item.itemName}</p>
                            <p>x{item.quantity}</p>
                            <p className="total">₱{item.totalPrice}</p>
                          </li>
                        </div>
                      </>
                    ))}
                  </ul>
                </div>
                <div className="order-total">
                  <p>Total: ₱{calculatePerPersonTotal(orderData.items)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
