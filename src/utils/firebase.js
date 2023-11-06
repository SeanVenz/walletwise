import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


//main wallet wise
const firebaseConfig = {
    apiKey: "AIzaSyDpw4tg4w_h7DnC5Ghv5PCb1wb7I7-V9rI",
    authDomain: "wallet-wise-baaf0.firebaseapp.com",
    projectId: "wallet-wise-baaf0",
    storageBucket: "wallet-wise-baaf0.appspot.com",
    messagingSenderId: "476283153582",
    appId: "1:476283153582:web:ec9322580c166d8865913f"
};

//backup walletwise
// const firebaseConfig = {
//     apiKey: "AIzaSyAxQCMnDwIkKkaJbfekmmmqEVZ8dxgIJd4",
//     authDomain: "wallet-wise-backup.firebaseapp.com",
//     projectId: "wallet-wise-backup",
//     storageBucket: "wallet-wise-backup.appspot.com",
//     messagingSenderId: "710739347504",
//     appId: "1:710739347504:web:25cb8098341eb5f95ec5f5"
//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const mapBoxToken = 'pk.eyJ1Ijoic3BlY2NjY2MiLCJhIjoiY2xuYWNmdTYxMDIycjJpcDF3cGRya3NmZSJ9.mAXVfy5YizpJb3o_3eqqMQ';

export { auth, db, storage, collection, getDocs, mapBoxToken  };
