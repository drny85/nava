import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../config";


const AppButton = ({ title, onPress, style, textStyle, disabled = false }) => {
	return (
		<TouchableOpacity style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]} disabled={disabled} onPress={onPress}>
			<Text style={[styles.text, textStyle]}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.primary,
		borderRadius: 25,
		width: "100%",
		padding: 12,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: COLORS.secondary
	},
	text: {
		color: COLORS.secondary,
		textTransform: "uppercase",
		...FONTS.h3
	},
});

export default AppButton;
