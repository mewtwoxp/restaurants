import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyBTqt0Rox7rvRzKD_VazYUFTOpAHSsAo24",
  authDomain: "restaurants-e98ba.firebaseapp.com",
  projectId: "restaurants-e98ba",
  storageBucket: "restaurants-e98ba.appspot.com",
  messagingSenderId: "1085021830087",
  appId: "1:1085021830087:web:9b652450e398737e5977e2"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)