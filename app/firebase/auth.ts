import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";


export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};


export const signup = async (
  email: string,
  password: string,
  username: string,
) => {

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;


  await setDoc(doc(db, "users", user.uid), {
    email,
    username,
    createdAt: new Date(),
  });

  return user;
};
