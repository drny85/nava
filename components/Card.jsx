// @ts-nocheck
import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import colors from "../config/colors";

const { height } = Dimensions.get("screen");

const Card = ({ name, imageUrl, price, onPress }) => {
	return (
		<TouchableOpacity style={styles.card} onPress={onPress}>
			<View style={{ height: "100%", width: "100%" }}>
				<View>
					<Image style={styles.image} source={{ uri: imageUrl }} />
				</View>
				<View style={styles.details}>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.price}>${price}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		justifyContent: "center",
		display: "flex",
		flexDirection: "row",
		width: "95%",
		height: height * 0.3,
		margin: 10,
		borderRadius: 15,
		marginBottom: 20,
		backgroundColor: colors.card,
		shadowOffset: {
			width: 3,
			height: 7,
		},
		shadowColor: "#95a5a6",
		shadowOpacity: 0.8,
		elevation: 12,
	},
	image: {
		width: "100%",
		height: "100%",

		borderRadius: 15,
	},
	details: {
		padding: 12,
		position: "absolute",
		bottom: 0,
		overflow: "hidden",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
		height: "auto",
		backgroundColor: "black",
		opacity: 0.5,
		borderBottomRightRadius: 15,
		borderBottomLeftRadius: 15,
	},
	name: {
		fontSize: 22,
		marginBottom: 8,
		fontWeight: "600",
		letterSpacing: 1.1,
		textTransform: "capitalize",
		color: "white",
	},
	price: {
		fontSize: 24,
		fontWeight: "600",
		color: "white",
	},
});

export default Card;
