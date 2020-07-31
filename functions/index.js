// @ts-nocheck
const functions = require("firebase-functions");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_3XShaHWNu48XiJcCo0OPgNls");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.makePayment = functions.https.onRequest(async (request, result) => {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			payment_method_types: ["card"],
			amount: 1000,
			currency: "usd"
		});
        const { client_secret } = paymentIntent;
        
        const confirmPayment = await stripe.paymentIntent.confirm({
            client_secret,
            {payment_method: 'card'}
        })
		return result.status(200).send({ client_secret });
	} catch (error) {
		console.log(error);
		return result.status(500).send({ error: "opsss" });
	}
});
