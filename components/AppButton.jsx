import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

const AppButton = ({ title, onPress, style, textStyle }) => {
	return (
		<TouchableOpacity style={[styles.container, style]} onPress={onPress}>
			<Text style={[styles.text, textStyle]}>{title}</Text>
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
		color: "#fff",
		fontWeight: "700",
		textTransform: "uppercase",
		fontSize: 20,
	},
});

export default AppButton;
