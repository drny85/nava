// @ts-nocheck
import React, { useContext, useEffect, useState, useRef } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import ordersContext from "../context/order/orderContext";

import constants from "../config/constants";
import Signin from "./Signin";
import authContext from "../context/auth/authContext";
import Loader from "../components/Loader";
import colors from "../config/colors";
import ProfileItem from "../components/profile/ProfileItem";
import AppButton from "../components/AppButton";
import Axios from "axios";
import { STRIPE } from "../config/stripeSettings";
import { stripeCheckoutRedirectHTML } from "../screens/StripeCheckout";

const Profile = ({ route, navigation }) => {
	const { orders, getOrders } = useContext(ordersContext);
	const { user, loading } = useContext(authContext);
	const order = route.params;
	const items = JSON.stringify(order.items);

	const handlePayment = async () => {};

	if (!user) {
		return <Signin />;
	}

	if (loading) return <Loader />;

	// TODO: this should come from some service/state store

	const onSuccessHandler = () => {
		navigation.replace("OrderConfirmation");
		/* TODO: do something */
	};
	const onCanceledHandler = () => {
		/* TODO: do something */
		console.log("CANCELED");
	};

	// Called everytime the URL stats to load in the webview
	const onLoadStart = (syntheticEvent) => {
		const { nativeEvent } = syntheticEvent;
		console.log("event", nativeEvent);
		if (nativeEvent.url === STRIPE.SUCCESS_URL) {
			onSuccessHandler();
			return;
		}
		if (nativeEvent.url === STRIPE.CANCELED_URL) {
			onCanceledHandler();
		}

		// if (nativeEvent.url == "about:blank") {
		// 	console.log("BLANK");
		// 	navigation.goBack();
		// }
	};

	// Render
	if (!user) {
		return null;
	}

	return (
		<WebView
			originWhitelist={["*"]}
			source={{ html: stripeCheckoutRedirectHTML(order, items) }}
			onLoadStart={onLoadStart}
		/>
	);

	// <WebView
	// 	originWhitelist={["*"]}
	// 	source={{
	// 		html: `<!DOCTYPE html>
	// 	<html lang="en">

	// 	<head>
	// 		<meta charset="UTF-8">
	// 		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	// 		<title>Checkout</title>
	// 		<script src="https://js.stripe.com/v3/"></script>
	// 	</head>

	// 	<body>
	// 		<div style="padding: 0 auto; position: absolute; top: 50%;left: 50%;transform: translate(-50%, -50%);">
	// 			<h4>Click here to make payment</h4>
	// 			<button
	// 				style="width: 100%;padding: 20px 40px;background-color: rgb(119, 21, 42);border-radius: 30px; color: beige; font-size: 1rem; font-weight: 700;"
	// 				id="checkout-button">Checkout</button>
	// 		</div>

	// 		<script>
	// 			var stripe = Stripe( 'pk_test_TiDXL9oIM686kqlByJgE4P5x' );
	// 			var checkoutButton = document.getElementById( 'checkout-button' );

	// 			checkoutButton.addEventListener( 'click', function () {
	// 				var response = fetch( 'http://localhost:4000/pay', {
	// 					method: 'POST',
	// 					body: JSON.stringify( {
	// 						amount: "25",
	// 						name: 'Apple',
	// 						email: 'drny10@me.com',
	// 						customer: {
	// 							name: 'Robert Melendez',
	// 							phone: '6462251912'
	// 						}
	// 					} ),
	// 					headers: {
	// 						'Accept': 'application/json',
	// 						'Content-Type': 'application/json'
	// 					}
	// 				} ).then( function ( response ) {
	// 					console.log( response );
	// 					return response.json();
	// 				} ).then( function ( responseJson ) {
	// 					var sessionID = responseJson.session_id;

	// 					// Call stripe.redirectToCheckout() with the Session ID.
	// 					stripe.redirectToCheckout( {

	// 						// Make the id field from the Checkout Session creation API response
	// 						// available to this file, so you can provide it as argument here
	// 						// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
	// 						sessionId: sessionID
	// 					} ).then( function ( result ) {
	// 						console.log( result.error.message )

	// 					} );
	// 				} );

	// 			} );
	// 		</script>
	// 	</body>

	// 	</html>`,
	// 	}}
	// 	style={{ marginTop: 5 }}
	// />
	// 	);
	// };

	// const styles = StyleSheet.create({
	// 	container: {
	// 		flex: 1,
	// 		width: "100%",

	// 		alignItems: "center",
	// 	},
	// 	imageView: {
	// 		width: "100%",
	// 		height: constants.heigth * 0.3,
	// 	},
	// 	img: {
	// 		width: "100%",
	// 		height: "100%",
	// 	},
	// });
};
export default Profile;
