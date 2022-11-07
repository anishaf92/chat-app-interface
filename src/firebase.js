import { initializeApp } from 'firebase/app'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAn_A5q8U8lQ6NXWXDTYGwuN_g0y28gnvk",
    authDomain: "chat-app-a2f0d.firebaseapp.com",
    projectId: "chat-app-a2f0d",
    storageBucket: "chat-app-a2f0d.appspot.com",
    messagingSenderId: "175928435305",
    appId: "1:175928435305:web:1958ee090793e1852bb8f8"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
export {auth}