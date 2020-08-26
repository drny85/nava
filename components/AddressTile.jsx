import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Dimensions } from "react-native";
import colors from "../config/colors";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

const AddressTile = ({ address }) => {
	const [preferred, setPreferred] = useState(false);

	const togglePreferred = () => {
		setPreferred(!preferred);
	};
	return (
		<TouchableWithoutFeedback onPress={togglePreferred}>
			<View style={styles.container}>
				<View>
					<Text style={styles.text}>
						{address.address} {address.apt ? address.apt : null}
					</Text>
					<Text style={styles.text}>
						{address.city}, {address.zipcode}
					</Text>
				</View>
				<View>
					{preferred && (
						<AntDesign
							style={{ paddingRight: 10 }}
							name="checkcircleo"
							size={24}
							color={colors.primary}
						/>
					)}
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height * 0.1,
		backgroundColor: colors.tile,
		flex: 1,
		padding: 10,
		borderTopColor: colors.secondary,
		borderBottomColor: colors.secondary,
		borderWidth: 1.5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	text: {
		marginVertical: 5,
		fontSize: 16,
		fontFamily: "montserrat",
	},
});

export default AddressTile;
