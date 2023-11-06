import React, { useState, useEffect } from "react";
import { addFood, getVendorFoods, addAllFood } from "../../service/FoodService";
import { auth, db } from "../../utils/firebase";
import "./Vendor.scss";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import closeButton from '../../images/close.png'
import { sendEmail } from "utils/contact";

function Vendor() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("No Shop Name");
  const [createdFood, setCreatedFood] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [foods, setFoods] = useState([]);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [showSupport, setShowSupport] = useState(false);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [textarea, setTextarea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [userComments, setUserComments] = useState([]);
  const [userComment, setUserComment] = useState("");

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
  };

  const fetchComments = async (id) => {
    const foodId = id;
    const commentsRef = collection(db, "food", foodId, "comments");

    // Query the comments collection and order by timestamp in ascending order
    const commentQuery = query(commentsRef, orderBy("timeStamp"));

    const querySnapshot = await getDocs(commentQuery);
    const commentsData = querySnapshot.docs.map((doc) => doc.data());

    setUserComments(commentsData);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch ID number from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setStoreName(docSnap.data().idNumber);
        setLongitude(docSnap.data().longitude);
        setLatitude(docSnap.data().latitude);
        setEmail(docSnap.data().email);
        setFullName(docSnap.data().displayName);
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  });

  const [foodData, setFoodData] = useState({
    foodName: "",
    price: 0,
    isAvailable: false,
    image: null,
    foodType: 0,
    quantity: "",
    storeName: storeName,
    longitude: longitude,
    latitude: latitude,
  });

  // Fetch all foods from the Firestore using FoodService
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const userId = auth.currentUser.uid;
        const foodsData = await getVendorFoods(userId);
        setFoods(foodsData);
      } catch (error) {
        console.error("Error fetching vendor foods:", error);
      }
    };

    fetchFoods();
  }, []);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFoodData({
      ...foodData,
      storeName: storeName,
      longitude: longitude,
      latitude: latitude,
      [name]: type === "checkbox" ? event.target.checked : value,
    });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFoodData({
      ...foodData,
      storeName: storeName,
      image: imageFile,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);

    try {
      const userId = auth.currentUser.uid;
      await addAllFood({ ...foodData, userId: userId });
      await addFood({
        ...foodData,
        storeName: storeName,
        userId: userId,
        longitude: longitude,
        latitude: latitude,
      });

      // Fetch the updated list of foods again
      const updatedFoods = await getVendorFoods(userId);
      setFoods(updatedFoods);

      setSuccessMessage("Food successfully created!");

      // Reset the form fields in the state
      setFoodData({
        foodName: "",
        price: 0,
        isAvailable: false,
        image: null,
        foodType: "",
        quantity: 0,
        longitude: longitude,
        latitude: latitude,
      });
    } catch (error) {
      console.error("Error creating food:", error);
    }
  };

  const handleNewFoodClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFoodData({
      FoodType: "",
      Name: "",
      isAvailable: true,
      Price: 0,
      Quantity: 0,
      File: null,
      longitude: longitude,
      latitude: latitude,
    });
    setCreatedFood(null);
    setSuccessMessage("");
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        // Reference to the specific item in the cart
        const vendorFoodRef = doc(db, "vendors", userId, "foods", itemId);
        const foodRef = doc(db, "food", itemId);

        const vendorRefSnapshot = await getDoc(vendorFoodRef);

        if (vendorRefSnapshot.exists()) {
          // Ensure newQuantity is parsed as an integer
          const updatedQuantity = parseInt(newQuantity);

          await updateDoc(vendorFoodRef, { Quantity: updatedQuantity });
          await updateDoc(foodRef, { Quantity: updatedQuantity });

          // Update the quantity in the local state
          const updatedFoods = foods.map((food) => {
            if (food.id === itemId) {
              return { ...food, Quantity: updatedQuantity };
            } else {
              return food;
            }
          });
          setFoods(updatedFoods);
        }
      } else {
        console.error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const customModalStyles = {
    display: showModal ? "block" : "none",
  };

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  const removeItemVendor = async (foodName) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const foodId = `${userId}-${foodName}`;

        const cartItemRef = doc(db, "vendors", userId, "foods", foodId);
        const foodRef = doc(db, "food", foodId);

        await deleteDoc(cartItemRef);
        await deleteDoc(foodRef);

        const vendorFood = await getVendorFoods(userId);
        setFoods(vendorFood);
      } else {
        console.error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleOpenSupport = () => {
    setShowSupport(true);
  };

  const handleCloseSupport = () => {
    setSubject("");
    setTextarea("");
    setShowSupport(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendEmail(textarea, subject, fullName, email);
      setSubject("");
      setTextarea("");
      setTimeout(() => {
        setSubmissionMessage("Your form has been submitted");
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmissionMessage("An error occurred during submission");
      setIsSubmitting(false);
    }
  };

  const handleOpenCommentModal = (foodId) => {
    fetchComments(foodId);
    setShowCommentModal(true);
  };

  return (
    <div className="h-screen w-screen gap-10 flex flex-col main-page justify-between">
      <div className="w-full px-[60px] lg:px-10 flex flex-row justify-between items-end lg:items-center title-add-button">
        <strong className="w-full text-[25px]">{storeName}</strong>
        <div className="logout-vendor flex items-center">
          <div className="logout-button">
            <p className="message" onClick={handleOpenSupport}>
              Contact Customer Support
            </p>
            {showSupport && (
              <div className="customer-modal">
                <div className="customer-modal-content">
                  <div className="close">
                    <img
                      className="close-chat"
                      onClick={handleCloseSupport}
                      alt="close"
                      src={closeButton}
                    ></img>
                  </div>
                  <p>
                    Please indicate in the message your Facebook or Messenger
                    account so we can contact you immediately
                  </p>
                  <form onSubmit={handleFormSubmit}>
                    {isSubmitting ? (
                      <p>Submitting...</p>
                    ) : submissionMessage ? (
                      <p>{submissionMessage}</p>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="subject">Subject:</label>
                          <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="textarea">Message:</label>
                          <textarea
                            id="textarea"
                            value={textarea}
                            onChange={(e) => setTextarea(e.target.value)}
                          />
                        </div>
                        <button type="submit">Submit</button>
                      </>
                    )}
                  </form>
                </div>
              </div>
            )}
            <button onClick={handleLogOut}>Log Out</button>
          </div>
        </div>
      </div>
      <div className="my-table overflow-auto rounded-lg">
        {foods.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Available</th>
                <th>Image</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id}>
                  <td>{food.Name}</td>
                  <td>{food.Price}</td>
                  <td>{food.isAvailable ? "Yes" : "No"}</td>
                  <td className="flex items-center justify-center">
                    <img src={food.ImageUrl} alt={food.Name} style={{marginTop: "0"}}/>
                  </td>
                  <td>{parseInt(food.Quantity)}</td>
                  <td>
                    <div className="flex flex-col h-full w-full text-[30px]">
                      <button
                        onClick={() =>
                          updateItemQuantity(food.id, food.Quantity - 1)
                        }
                        className="bg-white px-5 rounded-lg"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          updateItemQuantity(food.id, food.Quantity + 1)
                        }
                        className="bg-white px-5 rounded-lg"
                      >
                        +
                      </button>
                      <button
                        className="minus"
                        onClick={() => removeItemVendor(food.Name)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                  <td>
                    <p className="comments-link" onClick={() => handleOpenCommentModal(food.id)}>
                      Comments
                    </p>
                  </td>
                  <div className="comments">
                    {showCommentModal && (
                      <div className="comment-modal">
                        <div className="comment-modal-content w-[70%] md:w-[50%] lg:w-[30%]">
                          <div className=" flex flex-col h-full">
                            <div className="close-button flex w-full justify-end">
                              <img
                                src= {closeButton}
                                alt="close"
                                onClick={handleCloseCommentModal}
                                // className="pt-2"
                                style={{width: "10%"}}
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
                                  .reverse()
                                  .map((comment, index) => (
                                    <li
                                      key={index}
                                      className="flex flex-col py-1"
                                    >
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
                                        {new Date(
                                          comment.timeStamp
                                        ).toLocaleString()}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No foods available.</p>
        )}
      </div>
      <div className="w-full flex justify-center p-5 sticky">
        <div className="my-button w-[80%]">
          <button onClick={handleNewFoodClick}>ADD FOOD</button>
        </div>
      </div>
      <div
        className="vendor-custom-modal  overflow-auto"
        style={customModalStyles}
      >
        <div className="custom-modal-content w-full md:w-auto">
          <div className="modal-header">
            <h2 className="modal-title">Add Food</h2>
          </div>
          <div className="modal-body">
            <form className="modal-form">
              <div className="input-group input-food-type">
                <label>
                  Type of Food:
                  <select
                    name="foodType"
                    value={foodData.foodType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select option ...</option>
                    <option value="Main Dish">Main Dish</option>
                    <option value="Kakanin">Kakanin</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </label>
              </div>
              <div className="input-group input-name">
                <label>
                  Food Name:
                  <input
                    type="text"
                    name="foodName"
                    value={foodData.foodName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="input-group input-price">
                <label>
                  Price:
                  <input
                    type="number"
                    name="price"
                    value={foodData.price}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="input-group input-price">
                <label>
                  Quantity:
                  <input
                    type="number"
                    name="quantity"
                    value={foodData.quantity}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className=" input-available">
                <label>
                  <div className="parent-available">
                    <span>Is it Available?</span>
                  </div>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={foodData.isAvailable}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className=" input-img">
                <label>
                  Image:
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange}
                    required
                  />
                </label>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button onClick={handleCloseModal}>Close</button>
            <button onClick={handleSubmit}>Add Food</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vendor;
