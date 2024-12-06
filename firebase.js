
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification,  sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, signOut  } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, updateDoc, deleteField, doc, deleteDoc ,where, getDocs} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCgCwZEKjRbVeEVyTh3IZfmBGM5DNHvONM",
  authDomain: "hackthone-91dbd.firebaseapp.com",
  projectId: "hackthone-91dbd",
  storageBucket: "hackthone-91dbd.firebasestorage.app",
  messagingSenderId: "1078032803066",
  appId: "1:1078032803066:web:ab856169a5bcb2dcaf5543",
  measurementId: "G-TLN974YGWW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();


export {auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification,  sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, provider, signOut, db, collection, addDoc, onSnapshot, serverTimestamp, orderBy, query, updateDoc, deleteField, doc, deleteDoc ,where, getDocs  }
