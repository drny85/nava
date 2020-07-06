import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductDetail = () => {
	return (
		<View style={styles.screen}>
			<Text>Product Details</Text>
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

export default ProductDetail;
