import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Restaurants = () => {
	return (
		<View style={styles.screen}>
			<Text>Restaurants</Text>
		</View>
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
