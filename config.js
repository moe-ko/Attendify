// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration 

const firebaseConfig = {
    apiKey: "AIzaSyB_vIaCtpu0vxCmuLlTOa0xVWeR9arq9nc",
    authDomain: "attendify-cf931.firebaseapp.com",
    projectId: "attendify-cf931",
    storageBucket: "attendify-cf931.appspot.com",
    messagingSenderId: "804119425420",
    appId: "1:804119425420:web:7d3ea1f3258ec9239866a9"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}
export { firebase }
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

