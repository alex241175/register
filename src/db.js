import firebase from 'firebase/compat/app'  // for version 9
import 'firebase/compat/firestore'

var config = {
    apiKey: "AIzaSyC4H1hWjS2JMopVTnbvWe47Y3YDAO16ZDM",
    authDomain: "register-3c0b8.firebaseapp.com",
    projectId: "register-3c0b8",
    storageBucket: "register-3c0b8.appspot.com",
    messagingSenderId: "17863275969",
    appId: "1:17863275969:web:86dc859c427e97c4a32b40"
  };

// Get a Firestore instance
export const db = firebase.initializeApp(config).firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
db.settings({ timestampsInSnapshots: true })