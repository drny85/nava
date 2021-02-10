import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import { COLORS } from "../config";

const AppInput = ({ iconName, e = null, focus = false, style, ...otherProps }) => {
	return (
		<View style={styles.container}>
			{iconName && (
				<MaterialCommunityIcons
					style={styles.icon}
					size={24}
					color={COLORS.primary}
					name={iconName}
				/>
			)}
			<TextInput
				autoFocus={focus}
				autoCapitalize={e}
				placeholderTextColor={COLORS.secondary}
				style={[styles.input, style]}
				{...otherProps}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 50,
		marginVertical: 12,
		padding: 8,
		borderRadius: 25,
		alignItems: "center",
		backgroundColor: COLORS.tile,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "grey",
	},
	icon: {
		marginRight: 10,
	},
	input: {
		color: "black",
		fontSize: 20,
		padding: 5,
		height: "100%",
	},
});

export default AppInput;
