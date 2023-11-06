import React, { useEffect, useState } from "react";
import "./FoodCard.scss";
import cart from "../../images/cart.png";
import map from "../../images/location.png";
import { db } from "../../utils/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import authService from "../../utils/auth";
import MapboxMarker from "components/Mapbox/MapBoxMarker";
import comments from "../../images/comments.png";
import close from "../../images/close.png";

export const FoodCard = (props) => {
  const { img, name, price, number, storeName, id, latitude, longitude } =
    props;
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(-5);
  const numberOfLines = (userComment.match(/\n/g) || []).length + 1;

  const handleSeeMore = () => {
    setVisibleComments(() => visibleComments - 5);
  };

  const handleOpenMapModal = () => {
    setShowMapModal(true);
  };

  const handleOpenCommentModal = () => {
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setVisibleComments(-5);
    setShowCommentModal(false);
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddToCart = async () => {
    try {
      if (quantity > number) {
        setErrorMsg("There is not enough stock!");
        return false;
      }
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid;
        const itemId = `${userId}-${name}-${id}`;

        const cartDocRef = doc(db, "carts", userId, "items", itemId);

        const cartCollection = collection(db, "carts", userId, "items");
        const querySnapshot = await getDocs(cartCollection);

        let foundExistingItem = false;

        querySnapshot.forEach(async (doc) => {
          if (doc.data().foodId === id) {
            foundExistingItem = true;

            const existingQuantity = doc.data().quantity;
            const existingPrice = doc.data().unitPrice;
            const existingTotalPrice = doc.data().totalPrice;
            await updateDoc(cartDocRef, {
              quantity: existingQuantity + quantity,
              totalPrice: existingTotalPrice + existingPrice * quantity,
            });
          }
        });

        if (!foundExistingItem) {
          await setDoc(cartDocRef, {
            foodId: id,
            name: name,
            unitPrice: price,
            quantity: quantity,
            totalPrice: price * quantity,
            storeName: storeName,
            number: number,
            img: img,
          });
        }

        setQuantity(1);
        setShowModal(false);
      } else {
        console.error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const addComment = async () => {
    if (!userComment || userComment.trim() === "") {
      return;
    }

    try {
      const user = authService.getCurrentUser();

      if (user) {
        const userId = user.uid;
        const foodId = id;
        const commentRef = collection(db, "food", foodId, "comments");

        await addDoc(commentRef, {
          userId: userId,
          userName: user.displayName,
          comment: userComment,
          timeStamp: Date.now(),
        });

        setUserComment("");
        fetchComments();
      } else {
        console.error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const fetchComments = async () => {
    const foodId = id;
    const commentsRef = collection(db, "food", foodId, "comments");

    // Query the comments collection and order by timestamp in ascending order
    const commentQuery = query(commentsRef, orderBy("timeStamp"));

    const querySnapshot = await getDocs(commentQuery);
    const commentsData = querySnapshot.docs.map((doc) => doc.data());

    setUserComments(commentsData);
  };

  useEffect(() => {
    const fetchComments = async () => {
      const foodId = id;
      const commentsRef = collection(db, "food", foodId, "comments");

      // Query the comments collection and order by timestamp in ascending order
      const commentQuery = query(commentsRef, orderBy("timeStamp"));

      const querySnapshot = await getDocs(commentQuery);
      const commentsData = querySnapshot.docs.map((doc) => doc.data());

      setUserComments(commentsData);
    };

    fetchComments();
  }, []);

  return (
    <div>
      <div className="card flex justify-between items-center flex-col flex-grow overflow-auto">
        <div className="foodname flex flex-col items-center justify-between h-full pt-5">
          <img src={img} alt="Food" className="market-food-image flex" />

          <div className="detailsFood flex flex-col">
            <h3>{name}</h3>
            <div>
              <h5>
                <strong>₱{parseFloat(price).toFixed(2)}</strong>
              </h5>
              <p>In Stock: {number}</p>
              <span className="text-[16px] font-thin">{storeName}</span>
            </div>
          </div>
        </div>

        <div className="bottom mt-10">
          <img src={cart} alt="cart" onClick={handleOpenModal} />
          <img src={comments} alt="Comment" onClick={handleOpenCommentModal} />
          <img src={map} alt="map" onClick={handleOpenMapModal} />
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content addToCart-Modal">
            <h2 className="add-to-cart-label">ADD TO CART</h2>
            <h2 className="item-name-label">Item Name:</h2>
            <h2 className="item-name">{name}</h2>
            <div className="quantity">
              <h2 className="quantity-label">Quantity:</h2>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
              <strong>{errorMsg}</strong>
            </div>
            <hr></hr>
            <div>
              <button className="add-btn" onClick={handleAddToCart}>
                ADD TO CART
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
      {showMapModal && (
        <div className="modal">
          <div className="mapModal justify-center bg-red-500">
            <div className="map-container">
              <MapboxMarker latitude={latitude} longitude={longitude} />
            </div>
            <button onClick={handleCloseMapModal} className="close-button">
              Close Map
            </button>
          </div>
        </div>
      )}
      <div className="comments">
        {showCommentModal && (
          <div className="comment-modal">
            <div className="comment-modal-content w-[70%] md:w-[50%] lg:w-[30%]">
              <div className=" flex flex-col h-full">
                <div className="close-button flex w-full justify-end">
                  <img
                    src={close}
                    alt="close"
                    onClick={handleCloseCommentModal}
                    className="pt-2"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <h2 className=" font-[source-code-pro] text-[20px]">
                    Comments:
                  </h2>
                  <ul
                    className="overflow-y-auto custom-inner-shadow rounded-3xl p-3  w-[100%] h-full"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "transparent transparent",
                    }}
                  >
                    {userComments
                      .slice(visibleComments)
                      .reverse()
                      .map((comment, index) => (
                        <li key={index} className="flex flex-col py-1">
                          <div className="flex flex-col w-full px-5 bg-blue-200 rounded-lg shadow-inner py-2">
                            <strong className="w-full flex">
                              {comment.userName}
                            </strong>
                            <div
                              className="px-4 w-full text-justify"
                              style={{
                                maxWidth: "100%",
                                wordWrap: "break-word",
                                alignItems: "start",
                              }}
                            >
                              {comment.comment}
                            </div>
                          </div>
                          <span className="flex w-full justify-end pr-4">
                            {new Date(comment.timeStamp).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    {Math.abs(visibleComments) <= userComments.length && (
                      <button
                        onClick={handleSeeMore}
                        className="my-2 mx-auto text-blue-500 h-fit"
                      >
                        See More
                      </button>
                    )}
                  </ul>
                  <div className="flex py-2 justify-center gap-5">
                    <textarea
                      type="text"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="flex w-full h-full overflow-auto shadow-inner border-2 border-gray-300"
                      style={{
                        maxWidth: "100%",
                        wordWrap: "break-word",
                      }}
                    />
                    <button
                      className="flex justify-center items-center w-[150px] hover:bg-red-300 hover:border-1 hover:border-black rounded-lg border-2 border-[#e94e7399]"
                      onClick={addComment}
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
