import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBYn9oiy2rJIwTKEJThVMItTBNFP9g_8Tw",
  authDomain: "dca-crypto-6f36c.firebaseapp.com",
  projectId: "dca-crypto-6f36c",
  storageBucket: "dca-crypto-6f36c.appspot.com",
  messagingSenderId: "979518097486",
  appId: "1:979518097486:web:e98f011f8710a330f31b1f",
  measurementId: "G-1MRG7MBWX8"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };