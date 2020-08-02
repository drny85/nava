import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../components/Screen";

const OrderConfirmation = ({ navigation }) => {
	useEffect(() => {
		console.log("FROM Confirmation", navigation);
		setTimeout(() => {
			navigation.replace("MyOrders");
		}, 3000);
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
