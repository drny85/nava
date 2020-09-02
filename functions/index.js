// @ts-nocheck
// // @ts-nocheck
const functions = require("firebase-functions");
// // The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const app = express();
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_3XShaHWNu48XiJcCo0OPgNls");

app.use(cors());
app.use(express.json());

app.post("/payment", async (req, res) => {
  try {
    const { items, email } = req.body;
    const newItems = items.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: parseInt(item.price) * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email.toLowerCase(),
      line_items: newItems,
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    return res.status(200).send({
      session_id: session.id,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500).send(error.message);
  }
});

exports.makePayment = functions.https.onRequest(app);
