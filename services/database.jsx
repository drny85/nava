import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import Constants from "expo-constants";

const {
	apiKey,
	authDomain,
	databaseURL,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
	measurementId,
} = Constants.manifest.extra;

const firebaseConfig = {
	apiKey: apiKey,
	authDomain: authDomain,
	databaseURL: databaseURL,
	projectId: projectId,
	messagingSenderId: messagingSenderId,
	storageBucket: storageBucket,
	appId: appId,
	measurementId: measurementId,
};
// Initialize Firebase

let app;
if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);

} else {
	app = firebase.app()
}

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// robert_delicia_key = 'pk_test_51IK5fOLeHJQV7OD6xSLeZGPNNLXKThCPv4ZBG9dh34N6v5tP6cPdbsytaApGFEJU5sdSpqDzf6s2m6JGwgf1T8ET00jcETtEiB'
// robert_delicia_secret_key = 'sk_test_51IK5fOLeHJQV7OD6ZmSgwFEcAHes76TierxH2CB8JzO04TtuHFEdxhznqu1dobKhNsECgcarABnjrlnFnm5z3Dsv00kBpZP1ZN'

export { db, storage, auth };
