import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../../components/Screen";

const OrderConfirmation = ({ navigation, route }) => {
	const paymentMethod = route.params;

	const checkPaymentMethod = () => {
		if (paymentMethod === "credit") {
			setTimeout(() => {
				navigation.navigate("MyOrders");
			}, 3000);
		}
	};
	useEffect(() => {
		checkPaymentMethod();
	}, []);
	return (
		<Screen style={styles.screen}>
			<Text>Your order has been placed</Text>
		</Screen>
	);
};

const styles = StyleSheet.create({
	screen: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default OrderConfirmation;
