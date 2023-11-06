import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db, storage } from "../utils/firebase";

// export const getFoods = async () => {
//   try {
//     const vendorsCollection = collection(db, "vendors");
//     const vendorFoodQuery = query(vendorsCollection);
//     const vendorSnapshot = await getDocs(vendorFoodQuery);
//     console.log(vendorSnapshot.docs);

//     const vendorFoods = [];

//     for (const vendorDoc of vendorSnapshot.docs) {
//       const vendorId = vendorDoc.id;
//       const foodsCollection = collection(vendorDoc.ref, "foods");
//       const foodsSnapshot = await getDocs(foodsCollection);

//       foodsSnapshot.forEach((foodDoc) => {
//         vendorFoods.push({
//           ...foodDoc.data(),
//           id: foodDoc.id,
//           vendorId: vendorId,
//         });
//       });
//     }

//     return vendorFoods;
//   } catch (error) {
//     console.error("Error fetching data from Firestore:", error);
//     return [];
//   }
// };

export const getFoods = async () => {
  const vendorFoodCollection = collection(db, "vendors");
  const vendorFoodQuery = query(vendorFoodCollection);
  const vendorFoodSnapshot = await getDocs(vendorFoodQuery);
  
  return vendorFoodSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const getVendorFoods = async (userId) => {
  const vendorFoodCollection = collection(db, "vendors", userId, "foods");
  const vendorFoodQuery = query(vendorFoodCollection);
  const vendorFoodSnapshot = await getDocs(vendorFoodQuery);
  return vendorFoodSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const addFood = async ({
  foodName,
  price,
  isAvailable,
  image,
  foodType,
  quantity,
  userId,
  longitude,
  latitude,
}) => {
  try {
    const storageRef = ref(storage, `foodImages/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    // Create a unique identifier for the food item
    const foodId = `${userId}-${foodName}`;

    // Reference to the vendor-specific food collection
    const foodDocRef = doc(db, "vendors", userId, "foods", foodId);

    await setDoc(foodDocRef, { 
      Name: foodName,
      Price: price,
      isAvailable: isAvailable,
      ImageUrl: imageUrl,
      FoodType: foodType,
      Quantity: quantity,
      Longitude: longitude,
      Latitude: latitude,
      foodId: foodId,
    });

  } catch (error) {
    console.error("Error adding food item:", error);
    throw error;
  }
};

export const addAllFood = async ({
  foodName,
  price,
  isAvailable,
  image,
  foodType,
  quantity,
  storeName,
  latitude,
  longitude,
  userId
}) => {
  const storageRef = ref(storage, `images/${image.name}`);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  const foodId = `${userId}-${foodName}`;

  // Get a reference to the "food" collection and use addDoc to create a new document with a random ID
  const foodCollectionRef = doc(db, "food", foodId);
  await setDoc(foodCollectionRef, {
    Name: foodName,
    Price: price,
    isAvailable: isAvailable,
    ImageUrl: imageUrl,
    FoodType: foodType,
    Quantity: quantity,
    StoreName: storeName,
    Latitude: latitude,
    Longitude: longitude,
  });
};

export const getAllFoods = async () => {
  const foodCollection = collection(db, "food");
  const foodSnapshot = await getDocs(foodCollection);
  return foodSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};
