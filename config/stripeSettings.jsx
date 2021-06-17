export const STRIPE = {


	PLAN_NAME: "Antojito",
	SUCCESS_URL: "http://localhost:3000/payment/success",
	CANCELED_URL: "http://localhost:3000/payment/failed",
	PUBLIC_KEY_URL: "https://us-central1-grocery-409ef.cloudfunctions.net/makePayment/stripeKey",
	DB_URL:
		"https://us-central1-grocery-409ef.cloudfunctions.net/makePayment/payment",
};
