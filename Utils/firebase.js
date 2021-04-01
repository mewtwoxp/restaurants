import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA8jxi6COszn5P6IebYt9Lux5eqNMqGknY",
  authDomain: "restaurants-dbd6f.firebaseapp.com",
  projectId: "restaurants-dbd6f",
  storageBucket: "restaurants-dbd6f.appspot.com",
  messagingSenderId: "761699738677",
  appId: "1:761699738677:web:90dfbc56733993610c3d7c"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)