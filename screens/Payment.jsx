import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import authContext from "../context/auth/authContext";
import settingsContext from "../context/settings/settingsContext";

const Payment = ({ navigation }) => {
	const { user } = useContext(authContext);
	const { deliveryMethod } = useContext(settingsContext);

	console.log(deliveryMethod);

	if (!user) {
		navigation.navigate("Profile", {
			previewRoute: "Payment",
		});
	}

	return (
		<View style={styles.container}>
			<Text>Payment</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Payment;
