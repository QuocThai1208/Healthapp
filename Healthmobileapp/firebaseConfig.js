// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Thông tin cấu hình firebase
const firebaseConfig = {
  apiKey: "AIzaSyAP_hnNEVAxd0gSMt_KthuovTesMzm-xZc",
  authDomain: "fir-chat-963b6.firebaseapp.com",
  projectId: "fir-chat-963b6",
  storageBucket: "fir-chat-963b6.firebasestorage.app",
  messagingSenderId: "112634255808",
  appId: "1:112634255808:web:f94fbf781882a2c3db1025"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//khởi động hệ thống xác thực

//tạo database
export const db = getFirestore(app);

//thông tin người dùng và phòng chat 
export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms')
