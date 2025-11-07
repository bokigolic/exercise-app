import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClxI7ZKc8AwUcSSn4quuT3bKOiBcMBsLM",
  authDomain: "gym-master-app-8126a.firebaseapp.com",
  projectId: "gym-master-app-8126a",
  storageBucket: "gym-master-app-8126a.firebasestorage.app",
  messagingSenderId: "515399475443",
  appId: "1:515399475443:web:65701229da65c0d82e9786",
  measurementId: "G-TBK8GPVV54"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};
