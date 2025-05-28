// 📌 Firebase 연결 설정
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCiGNQy_adsN-_X9IRFFLsifW_oOzUVAHk",
  authDomain: "netflix-clone-b3529.firebaseapp.com",
  databaseURL: "https://netflix-clone-b3529-default-rtdb.firebaseio.com/",
  projectId: "netflix-clone-b3529",
  storageBucket: "netflix-clone-b3529.firebasestorage.app",
  messagingSenderId: "541884910346",
  appId: "1:541884910346:web:89c7ecfe185756ac9688f3",
  measurementId: "G-GQ9Q1VMD2V"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

export { db, analytics, ref, push, onValue, remove };
