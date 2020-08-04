import React, { useContext, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import ordersContext from "../../context/order/orderContext";
import authContext from "../../context/auth/authContext";

import Loader from "../../components/Loader";
import { STRIPE } from "../../config/stripeSettings";
import { WebView } from "react-native-webview";
import { stripeCheckoutRedirectHTML } from "../StripeCheckout";
import Signin from "../profiles/Signin";
import cartContext from "../../context/cart/cartContext";

const OrderVerification = ({ navigation, route }) => {
	const { orders, getOrders, placeOrder } = useContext(ordersContext);
	const { clearCart } = useContext(cartContext);
	const { user, loading } = useContext(authContext);
	const { order, paymentMethod } = route.params;
	const items = JSON.stringify(order.items);

	const webRef = useRef(null);

	const handlePayment = async () => {};

	if (!user) {
		return <Signin />;
	}

	if (loading) return <Loader />;

	// TODO: this should come from some service/state store

	const onSuccessHandler = async () => {
		const data = await placeOrder(order);

		clearCart();
		navigation.navigate("OrderConfirmation", { paymentMethod, order: data });
		/* TODO: do something */
	};
	const onCanceledHandler = () => {
		/* TODO: do something */
		navigation.goBack();
	};

	const handleChange = (newState) => {
		const { url } = newState;
		if (url.includes("/success")) {
			webRef.current.stopLoading();
			//resetCartNavigation();
			//maybe close this view?
		}
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
			ref={webRef}
			originWhitelist={["*"]}
			source={{ html: stripeCheckoutRedirectHTML(order, items) }}
			onLoadStart={onLoadStart}
			onNavigationStateChange={handleChange}
		/>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default OrderVerification;