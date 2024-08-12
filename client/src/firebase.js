import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvcxT3Kc2cMSe4IRgYJRLcz3L7YaHRrSc",
  authDomain: "tanulok-440eb.firebaseapp.com",
  projectId: "tanulok-440eb",
  storageBucket: "tanulok-440eb.appspot.com",
  messagingSenderId: "899329515297",
  appId: "1:899329515297:web:e6458d3d16f4366764e860",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
