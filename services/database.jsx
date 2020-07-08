import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBYxZ7c3saf5zHkXpDgXIkSzoIR6ogHbtg",
	authDomain: "grocery-409ef.firebaseapp.com",
	databaseURL: "https://grocery-409ef.firebaseio.com",
	projectId: "grocery-409ef",
	storageBucket: "grocery-409ef.appspot.com",
	messagingSenderId: "897113180247",
	appId: "1:897113180247:web:131d1ce3d7fddaeba13b12",
	measurementId: "G-FWR2GHNDSM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };
