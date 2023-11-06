import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { getFoods } from "../service/FoodService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch full name from the user profile
      if (auth.currentUser.displayName) {
        setFullName(auth.currentUser.displayName);
      }

      // Fetch ID number from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setPhoneNumber(docSnap.data().phoneNumber);
        setIdNumber(docSnap.data().idNumber);
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();

    // Fetch all foods from the API
    const fetchFoods = async () => {
      try {
        const foodsData = await getFoods();
        setFoods(foodsData);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Full Name: {fullName}</p>
      <p>ID Number: {idNumber}</p>
      <p>Phone Number: {phoneNumber}</p>
      <button onClick={handleLogOut}>Log Out</button>
      <h2>Available Foods:</h2>
      {foods.map((food, index) => (
        <div key={index}>
          <h3>Food Type: {food.FoodType}</h3>{" "}
          {/* Use "FoodType" instead of "foodType" */}
          <p>Food Name: {food.Name}</p> {/* Use "Name" instead of "name" */}
          <p>
            Availability: {food.isAvailable ? "Available" : "Not Available"}
          </p>
          <p>Price: {food.Price}</p> {/* Use "Price" instead of "price" */}
          <img src={food.ImageUrl} alt={food.Name}></img>{" "}
          {/* Use "ImageUrl" instead of "imageUrl" */}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;