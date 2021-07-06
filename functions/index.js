// @ts-nocheck
// // @ts-nocheck
const functions = require('firebase-functions');
// // The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const Stripe = require('stripe');
const config = require('./config');

const secrets = config.secret;
const public = config.public;
const url = config.url;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/payment', async (req, res) => {
	try {
		const { items, customer, cardFee, orderId, customerId } = req.body;

		const restaurantKey = items[0].storeId.toLowerCase();

		const stripe = Stripe(secrets[restaurantKey], { apiVersion: '2020-08-27' });

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
			const finalFee = Math.round(Math.abs(fee));

			newItems.push({
				description: 'Convinience fee',
				price_data: {
					currency: 'usd',
					product_data: {
						name: 'Fee',
					},
					unit_amount: finalFee,
				},
				quantity: 1,
			});
		}
		const cust = await stripe.customers.retrieve(customerId);

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: newItems,
			customer: cust && cust.id,
			mode: 'payment',
			metadata: customer,
			success_url: orderId
				? `${url.url}/payment/success/${orderId}`
				: `${url.url}/payment/success`,
			cancel_url: orderId
				? `${url.url}/payment/failed/${orderId}`
				: `${url.url}/payment/failed`,
		});

		return res.status(200).send({
			session_id: session.id,
		});
	} catch (error) {
		console.log('ERROR', error.message);
		return res.status(500).send(error.message);
	}
});

app.post('/mobile', async (req, res) => {
	// Use an existing Customer ID if this is a returning customer.
	try {
		const {
			email,
			phone,
			name,
			metadata,
			amount,
			cardFee,
			items,
			restaurantKey,
			customerId,
		} = req.body;

		if (!restaurantKey) return res.status(400).send('No Key provided');

		const stripe = Stripe(secrets[restaurantKey.toLowerCase()], {
			apiVersion: '2020-08-27',
		});

		let finalAmount = amount;

		if (cardFee) {
			const percent = +((amount + 0.3) / (1 - 0.029));
			const fee = +(amount - percent).toFixed(2) * 100;
			const finalFee = Math.round(Math.abs(fee)) / 100;

			finalAmount += finalFee;
		}

		const customer = await stripe.customers.retrieve(customerId);
		const ephemeralKey = await stripe.ephemeralKeys.create(
			{ customer: customer.id },
			{ apiVersion: '2020-08-27' }
		);
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(finalAmount * 100),
			payment_method_types: ['card'],
			currency: 'usd',
			customer: customer.id,
			receipt_email: email,
			metadata: {
				...metadata,
				items: JSON.stringify(items),
			},
		});

		return res.status(200).json({
			paymentIntent: paymentIntent.client_secret,
			ephemeralKey: ephemeralKey.secret,
			customer: customer.id,
		});
	} catch (error) {
		return res.status(400).send('Error', error.message);
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

app.post('/create_stripe_customer', async (req, res) => {
	try {
		const { email, userId, restaurantId, name, metadata } = req.body;
		console.log('BODY', req.body);
		if (!userId) return res.status(400).json({ message: 'No user ID' });
		const stripe = Stripe(secrets[restaurantId.toLowerCase()], {
			apiVersion: '2020-08-27',
		});
		const payment = await admin
			.firestore()
			.collection('stripe_customers')
			.doc(userId)
			.get();
		if (payment.exists) {
			return res.json(payment.data());
		} else {
			const customer = await stripe.customers.create({
				email,
				name,
				metadata: metadata && metadata,
			});
			await admin
				.firestore()
				.collection('stripe_customers')
				.doc(userId)
				.set({ customer_id: customer.id });

			return res.json({ customer_id: customer.id });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: 'error creating customer' });
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

				return res.update({
					unitSold: parseInt(i.data().unitSold + item.quantity),
				});
			} catch (error) {
				console.error('ERROR updating units sold', error);
				return null;
			}
		});
	});
