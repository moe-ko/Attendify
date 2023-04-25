// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration 

const firebaseConfig = {
    apiKey: "AIzaSyDIhRlnq04Z60UgF6b4_fxM1q_PQD0UDAM",
    authDomain: "attend-3096f.firebaseapp.com",
    projectId: "attend-3096f",
    storageBucket: "attend-3096f.appspot.com",
    messagingSenderId: "1062696918069",
    appId: "1:1062696918069:web:6cf11616b8c9973fbce57c",
    measurementId: "G-GY6Q8KQS3K"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}
// Initialize Firebase

export { firebase }
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app, storage };

