import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "@firebase/firestore";
import { db } from "./firebase";

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedDate;
}

export function groupItemsByStore(deliveryItems) {
  const storeItemsMap = new Map();
  deliveryItems.forEach((item) => {
    const storeName = item.storeName;
    if (!storeItemsMap.has(storeName)) {
      storeItemsMap.set(storeName, []);
    }
    storeItemsMap.get(storeName).push(item);
  });
  return storeItemsMap;
}

export function calculatePerPersonTotal(items) {
  let total = 0;
  items.forEach((item) => {
    total += item.totalPrice;
  });
  return total;
}

export const handleCancelOrder = async (ordererId, orderId) => {
  const userRef = doc(db, "users", ordererId);
  const userData = await getDoc(userRef);

  const orderRef = doc(db, "orders", orderId);
  const orderData = await getDoc(orderRef);

  if (userData.exists() && orderData.exists()) {
    await updateDoc(userRef, {
      hasPendingOrder: false,
    });

    await deleteDoc(orderRef);
  }
};

export const getAllUnverifiedStudents = async () => {
  const studentCollection = collection(db, "users");
  const studentCollectionQuery = query(studentCollection);
  const studentSnapshot = await getDocs(studentCollectionQuery);

  const unverifiedStudents = studentSnapshot.docs
    .filter((doc) => {
      const data = doc.data();
      return data.role === "student" && data.isVerified === false;
    })
    .map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    return unverifiedStudents;
}

export const approveStudent = async (uid) => {
  const studentRef = doc(db, "users", uid);
  const snap = await getDoc(studentRef);
  if(snap.exists()){
    await updateDoc(studentRef, {isVerified:true})
    await getAllUnverifiedStudents();
  }
}

export const getAllUnverifiedVendors = async () => {
  const vendorCollection = collection(db, "users");
  const vendorCollectionQuery = query(vendorCollection);
  const vendorSnapshot = await getDocs(vendorCollectionQuery);

  const unverifiedVendors = vendorSnapshot.docs
    .filter((doc) => {
      const data = doc.data();
      return data.role === "vendor" && data.isVerified === false;
    })
    .map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    return unverifiedVendors;
}

export const approveVendor = async (uid) => {
  const vendorRef = doc(db, "users", uid);
  const snap = await getDoc(vendorRef);
  if(snap.exists()){
    await updateDoc(vendorRef, {isVerified:true})
    await getAllUnverifiedVendors();
  }
}

export const deleteDocRef = async(user) => {
  const userRef = doc(db, "users", user.id);
  await deleteDoc(userRef);
}

export const getAllOrdersHistory = async () => {
  const orderRef = collection(db, "orders-history");
  const orderSnapshot = await getDocs(orderRef);

  const ordersArray = orderSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  
  return ordersArray;
}