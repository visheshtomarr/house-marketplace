// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyp1Iep88U6T_jeDcEj8aJjND6Ik9xaxc",
  authDomain: "house-marketplace-app-cb603.firebaseapp.com",
  projectId: "house-marketplace-app-cb603",
  storageBucket: "house-marketplace-app-cb603.appspot.com",
  messagingSenderId: "750914484962",
  appId: "1:750914484962:web:a89288db3f974abf077cbb",
  measurementId: "G-5VWR7Q8Y2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
