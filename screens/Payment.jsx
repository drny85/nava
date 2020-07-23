import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import authContext from "../context/auth/authContext";

const Payment = ({ route, navigation }) => {
	const { user } = useContext(authContext);
	const deliveryMethod = route.params.deliveryMethod;

	if (!user) {
		navigation.navigate("Profile", {
			previewRoute: "Payment",
			deliveryMethod,
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
