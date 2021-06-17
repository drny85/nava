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
		const { items, email, customer, cardFee } = req.body;

		const restaurantKey = items[0].storeId.toLowerCase();

		const stripe = Stripe(secrets[restaurantKey]);

		const newItems = items.map((item) => {
			return {
				description: item.description,
				price_data: {
					currency: 'usd',
					product_data: {
						name: item.name,
						images: [item.imageUrl],
					},
					unit_amount: item.price * 100,
				},
				quantity: item.quantity,
			};
		});

		if (cardFee) {
			const total = items.reduce(
				(current, index) => current + index.price * index.quantity,
				0
			);
			const percent = +((total + 0.3) / (1 - 0.029));
			const fee = +(total - percent).toFixed(2) * 100;

			newItems.push({
				description: 'Convinience fee',
				price_data: {
					currency: 'usd',
					product_data: {
						name: 'Fee',
					},
					unit_amount: Math.abs(fee),
				},
				quantity: 1,
			});
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			customer_email: email,
			line_items: newItems,
			mode: 'payment',
			metadata: customer,
			success_url: 'http://localhost:3000/payment/success',
			cancel_url: 'http://localhost:3000/payment/failed',
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

		if (!key) return res.status(400).send({ message: 'no key found' });
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
