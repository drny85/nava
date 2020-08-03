import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Settings = () => {
	return (
		<View style={styles.screen}>
			<Text>Settings</Text>
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

export default Settings;
