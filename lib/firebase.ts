// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAW2zBjv7RgEivJP6_v8A3pjelYoK0vkKs",
  authDomain: "tripleone-ea212.firebaseapp.com",
  projectId: "tripleone-ea212",
  storageBucket: "tripleone-ea212.appspot.com",
  messagingSenderId: "155346478256",
  appId: "1:155346478256:web:95dcdf0a7cf698fddb0775"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);