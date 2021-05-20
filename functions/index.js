// @ts-nocheck
// // @ts-nocheck
const functions = require('firebase-functions');
// // The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const app = express();
const cors = require('cors');
const Stripe = require('stripe');
const config = require('./config');

const secrets = config.secret;
const public = config.public;

app.use(cors());
app.use(express.json());

app.post('/payment', async (req, res) => {
	try {
		const { items, email } = req.body;
		const restaurantKey = items[0].storeId.toLowerCase();
		console.log('SECRET', restaurantKey);
		console.log('REST_KEY', secrets[restaurantKey]);
		const stripe = Stripe(secrets[restaurantKey]);
		const newItems = items.map((item) => {
			return {
				price_data: {
					currency: 'usd',
					product_data: {
						name: item.name,
					},
					unit_amount: item.price * 100,
				},
				quantity: item.quantity,
			};
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			customer_email: email.toLowerCase(),
			line_items: newItems,
			mode: 'payment',
			success_url: 'https://example.com/success',
			cancel_url: 'https://example.com/cancel',
		});

		return res.status(200).send({
			session_id: session.id,
		});
	} catch (error) {
		console.log('ERROR', error.message);
		return res.status(500).send(error.message);
	}
});

app.get('/stripeKey/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const key = public[id.toLowerCase()];

		return res.status(200).send(key);
	} catch (error) {
		console.log('Error prossesing payment', error);
		return res.status(500).send(error.message);
	}
});

exports.makePayment = functions.https.onRequest(app);

exports.updateUnitSold = functions.firestore
	.document('/orders/{orderId}')
	.onCreate(async (snap, contex) => {
		const items = snap.data().items;
		items.forEach(async (item) => {
			try {
				const i = await admin
					.firestore()
					.collection('items')
					.doc(item.storeId)
					.collection('items')
					.doc(item.id)
					.get();
				const res = await admin
					.firestore()
					.collection('items')
					.doc(item.storeId)
					.collection('items')
					.doc(item.id);
				console.log(
					`From ${i.data().unitSold} to ${i.data().unitSold + item.quantity}`
				);
				return res.update({
					unitSold: parseInt(i.data().unitSold + item.quantity),
				});
			} catch (error) {
				console.error('ERROR updating units sold', error);
				return null;
			}
		});
	});
