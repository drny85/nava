import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const Home = ({ navigation }) => {
	return (
		<View style={styles.screen}>
			<Text>Home</Text>
			<Button
				title="View Details"
				onPress={() =>
					navigation.navigate("ProductDetail", { title: "Details" })
				}
			/>
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

export default Home;
