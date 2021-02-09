import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import LottieView from "lottie-react-native";

const OrderInTheMaking = ({ navigation }) => {

	return (
		<TouchableWithoutFeedback onPress={() => navigation.goBack()}>
			<LottieView
				style={styles.container}
				loop
				resizeMode="center"
				autoPlay
				// colorFilters={[{ keypath: "Sending Loader", color: "#6D042A" }]}
				source={require("../../assets/animations/cooking.json")}
			/>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
});

export default OrderInTheMaking;
