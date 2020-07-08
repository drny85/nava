import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

const AppButton = ({ title, onPress, style }) => {
	return (
		<TouchableOpacity style={[styles.container, style]} onPress={onPress}>
			<Text style={styles.text}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.ascent,
		borderRadius: 25,
		width: "100%",
		padding: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: colors.primary,
		fontWeight: "700",
		textTransform: "uppercase",
		fontSize: 20,
	},
});

export default AppButton;
