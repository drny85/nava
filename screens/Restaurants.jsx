import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../components/Screen";

const Restaurants = () => {
	return (
		<Screen style={styles.screen}>
			<Text>Restaurants</Text>
		</Screen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Restaurants;
