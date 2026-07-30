import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZmubALIsC8pKfkUOJ9NjH91oubSX4r9M",
  authDomain: "calin-collective-25-26.firebaseapp.com",
  projectId: "calin-collective-25-26",
  storageBucket: "calin-collective-25-26.firebasestorage.app",
  messagingSenderId: "602378043172",
  appId: "1:602378043172:web:34f3e457bc99d9d24e3db1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rdb = getDatabase(app);

