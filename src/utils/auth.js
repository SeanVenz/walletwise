import { auth, db, storage } from "../utils/firebase"; // Import Firestore database
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const signUp = async (
  email,
  password,
  fullName,
  idNumber,
  phoneNumber,
  role
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Update the user's profile with the full name
  await updateProfile(user, { displayName: fullName });

  // Store the ID number in Firestore
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    displayName: fullName,
    email,
    idNumber,
    phoneNumber,
    role,
    isVerified: false,
  });

  await sendEmailVerification(user);
  return user;
};

const signUpVendor = async (
  email,
  password,
  fullName,
  idNumber,
  storeImage,
  phoneNumber,
  role,
  latitude,
  longitude
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const storeImageRefd = ref(storage, `storeImages/${storeImage.name}`);
  await uploadBytes(storeImageRefd, storeImage);
  const storeImageUrl = await getDownloadURL(storeImageRefd);

  // Update the user's profile with the full name
  await updateProfile(user, { displayName: fullName });

  // Store the ID number in Firestore
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    email,
    displayName: fullName,
    idNumber,
    phoneNumber,
    role,
    latitude,
    longitude,
    isVerified: false,
    imageUrl: storeImageUrl
  });

  await sendEmailVerification(user);
  return user;
};

const sendVerificationEmail = async (user) => {
  if (user) {
    await sendEmailVerification(user);
  } else {
    console.log("No user provided to sendVerificationEmail"); // Log if no user is provided
  }
};

const logIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

const logOut = async () => {
  await signOut(auth);
};

const getCurrentUser = () => {
  return auth.currentUser;
};

const sendResetPasswordEmail = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

const observeAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

const getUserRoleFromFirestore = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userDocSnapshot = await getDoc(userDocRef);
  if (userDocSnapshot.exists()) {
    return userDocSnapshot.data().role;
  } else {
    return null;
  }
};

const authService = {
  signUp,
  signUpVendor,
  sendVerificationEmail,
  logIn,
  logOut,
  getCurrentUser,
  sendResetPasswordEmail,
  observeAuthChanges,
  getUserRoleFromFirestore,
};

export default authService;
