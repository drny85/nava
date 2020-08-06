// @ts-nocheck
import React, { useState } from "react";
import { StyleSheet, Modal } from "react-native";

import { CommonActions } from "@react-navigation/native";

import Screen from "../../components/Screen";

import LottieView from "lottie-react-native";

const OrderConfirmation = ({ navigation, route }) => {
	const { order } = route.params;

	const [isVisible, setIsVisible] = useState(true);

	const resetCartNavigation = () => {
		navigation.dispatch(
			CommonActions.reset({
				index: 2,
				routes: [{ name: "Cart" }],
			})
		);
		navigation.navigate("Orders", {
			screen: "OrderDetails",
			params: { order },
		});
	};

	return (
		<Screen style={styles.screen}>
			<Modal
				visible={isVisible}
				animationType="slide"
				onDismiss={resetCartNavigation}
			>
				<LottieView
					loop={false}
					autoPlay
					colorFilters={[{ keypath: "Sending Loader", color: "#6D042A" }]}
					onAnimationFinish={() => setIsVisible(false)}
					source={require("../../assets/animations/done.json")}
				/>
			</Modal>
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
