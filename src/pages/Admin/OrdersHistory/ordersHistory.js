import React, { useEffect, useState } from "react";
import "./ordersHistory.scss";
import { calculatePerPersonTotal, getAllOrdersHistory } from "utils/utils";

function OrdersHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getHistory = async () => {
      const orders = await getAllOrdersHistory();
      setOrders(orders);
    };
    getHistory();
  }, []);

  return (
    <div className="admin-order-history">
      <h2>Order History</h2>
      {orders && orders.length > 0 ? (
        <div className="order-card-container">
          {orders.map((order, index) => (
            <div className="order-card" key={index}>
              <p className="order-id">Order ID: {order.id}</p>
              <div className="deets">
                <p>
                  <h3>Courier Details</h3>
                </p>
                <p>
                  <b>Name:</b> {order.courierName}
                </p>
                <p>
                  <b>ID Number:</b> {order.idNumber}
                </p>
                <p>
                  <b>Phone Number:</b> {order.courierPhoneNumber}
                </p>
              </div>
              <div className="deets">
                <p>
                  <h3>Buyer Details</h3>
                </p>
                <p>
                  <b>Name:</b> {order.userName}
                </p>
                <p>
                  <b>ID Number:</b> {order.recipientIdNumber}
                </p>
                <p>
                  <b>Phone Number:</b> {order.phoneNumber}
                </p>
              </div>
              <div className="admin-order-deets">
                <h3>Order Details:</h3>
                <div className="scrollable-list">
                  {order.items.map((item, index) => (
                    <div className="items" key={index}>
                      <p>
                        <b>Item #{index + 1}:</b> {item.itemName}
                      </p>
                      <p>
                        <b>Quantity:</b> {item.quantity}
                      </p>
                      <p>
                        <b>Item Price:</b> ₱{item.totalPrice}
                      </p>
                      <p>
                        <b>Item Store Name:</b> {item.storeName}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="total">Total: ₱{calculatePerPersonTotal(order.items)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders yet</p>
      )}
    </div>
  );
}

export default OrdersHistory;
