import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAgOmIQrmGAs5GQgm-1RCZ2RAuh2joevr8",
  authDomain: "chatapp-8381f.firebaseapp.com",
  projectId: "chatapp-8381f",
  storageBucket: "chatapp-8381f.appspot.com",
  messagingSenderId: "712241127441",
  appId: "1:712241127441:web:53f7afe8cffce229e8d1b0",
});

const db = firebaseConfig.firestore();
const auth = getAuth(firebaseConfig);
const storage = getStorage(firebaseConfig);
const reff = ref(firebaseConfig);
export default db;
export { auth, storage, reff };
