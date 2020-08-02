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

exports.makePayment = functions.https.onRequest(async (req, res) => {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Methods", "GET, POST");
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			customer_email: "rabin@aol.com",

			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: "Jose Mendez",
						},
						unit_amount: 2600,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url:
				"https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
			cancel_url: "https://example.com/cancel",
		});

		console.log(session.id);

		return res.status(200).json({ session_id: session.id });
	} catch (error) {
		console.log(error.message || error);
		return res.status(500).send("an error occured");
	}
});
