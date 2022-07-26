// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd4oQaBGLAnf9lxVb_HOPI_BaVEcBy0MQ",
  authDomain: "price-of-crypto.firebaseapp.com",
  databaseURL: "https://price-of-crypto-default-rtdb.firebaseio.com",
  projectId: "price-of-crypto",
  storageBucket: "price-of-crypto.appspot.com",
  messagingSenderId: "753231151691",
  appId: "1:753231151691:web:cf771915ecb853ffde43ce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
