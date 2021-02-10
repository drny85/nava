import React from "react";
import {
	View,
	StyleSheet,
	Image,
	Text,
	Dimensions,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from "react-native";
import colors from "../config/colors";

import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "../config";

const { width } = Dimensions.get("screen");

const CartItemTile = ({ item, onAddMore, onRemove, isDisable }) => {
	return (
		<TouchableWithoutFeedback>
			<View style={styles.container}>
				<View style={styles.imgView}>
					<Image style={styles.img} source={{ uri: item.imageUrl }} />
				</View>
				<View style={styles.details}>
					<View>
						<Text style={{ ...FONTS.h3, textTransform: 'capitalize', }}>{item.name}</Text>
						<View style={{ flexDirection: "row" }}>
							<Text style={styles.qty}>
								{item.quantity} x $
								{typeof item.price === "object"
									? parseFloat(item.price[item.size]).toFixed(2)
									: parseFloat(item.price).toFixed(2)}
							</Text>
							{item.size ? (
								<Text
									style={{
										paddingLeft: 20,
										color: colors.tile,
										textTransform: "capitalize",
									}}
								>
									{item.size}
								</Text>
							) : null}
						</View>
					</View>
					<View style={styles.totalView}>
						<View style={styles.mini}>
							<TouchableOpacity disabled={isDisable} onPress={onRemove}>
								<Feather name="minus" size={28} color="black" />
							</TouchableOpacity>
							<View style={styles.divider}></View>

							<TouchableOpacity disabled={isDisable} onPress={onAddMore}>
								<Feather name="plus" size={28} color="black" />
							</TouchableOpacity>
						</View>
						<View style={styles.priceView}>
							<Text style={styles.price}>
								$
								{typeof item.price === "object"
									? parseFloat(item.price[item.size] * item.quantity).toFixed(2)
									: parseFloat(item.price * item.quantity).toFixed(2)}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		width: width * 0.95,
		height: 120,
		backgroundColor: COLORS.secondary,
		borderRadius: 5,
		elevation: 10,
		margin: 10,
		shadowOffset: {
			height: 5,
			width: 5,
		},
		shadowOpacity: 0.4,
		shadowColor: "black",
		shadowRadius: 5,

		flexDirection: "row",
		alignItems: "center",
	},
	img: {
		height: "100%",
		width: "100%",
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	imgView: {
		width: "40%",
	},

	details: {
		alignItems: "flex-start",
		width: "60%",
		height: "100%",
		backgroundColor: COLORS.primary,
		padding: 10,
	},

	name: {
		fontSize: 20,
		fontWeight: "600",
		textTransform: "capitalize",
		marginBottom: 8,
		color: colors.secondary,
	},
	totalView: {
		width: "100%",
		padding: 2,
		marginTop: 5,
		height: 50,
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
	},
	price: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.secondary,
	},
	mini: {
		height: "100%",
		width: "50%",
		backgroundColor: COLORS.primary,

		borderRadius: 30,
		alignItems: "center",
		justifyContent: "space-around",
		flexDirection: "row",
		borderColor: COLORS.secondary,
		borderWidth: 0.2
	},
	priceView: {
		width: "40%",
		marginHorizontal: 5,

	},

	divider: {
		height: "100%",
		width: 2,
		backgroundColor: "grey",
	},
	qty: {
		color: COLORS.secondary,
	},
});

export default CartItemTile;
