import React, { useContext, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import AppButton from "../components/AppButton";
import { db } from "../services/database";
import cartContext from "../context/cart/cartContext";
import colors from "../config/colors";
import { color } from "react-native-reanimated";
import authContext from "../context/auth/authContext";

const Checkout = ({ route, navigation }) => {
	const {
		cart: { cartItems, cartTotal, itemCounts },
	} = route.params;
	const { user } = useContext(authContext);

	const [deliveryOption, setDeliveryOption] = useState("delivery");

	const { clearCart } = useContext(cartContext);

	const continueToPayment = () => {
		if (!user) {
			navigation.navigate("Profile", { deliveryMethod: deliveryOption });
			return;
		}
		navigation.navigate("Payment", { deliveryMethod: deliveryOption });
		// const data = await db.collection("orders").add({
		// 	customer: {
		// 		address: {
		// 			street: "1830 morris ave",
		// 			apt: "6c",
		// 			city: "bronx",
		// 			zipcode: "10456",
		// 		},
		// 		email: "maria.m@aol.com",
		// 		name: "joel",
		// 		lastName: "lopez",
		// 		phone: "347-222-2222",
		// 	},
		// 	items: [...cartItems],
		// 	orderPlaced: new Date().toISOString(),
		// 	status: "new",
		// 	totalAmount: cartTotal,
		// 	orderNumber: 3,
		// });

		// if (data.id) {
		// 	console.log("clearCart");
		// 	clearCart();
		// }
	};

	console.log(deliveryOption);

	return (
		<View style={styles.container}>
			<Text style={styles.summary}>Order Summary</Text>
			<View style={styles.view}>
				<Text style={styles.qty}>Items Quantity: {itemCounts}</Text>
				<Text style={styles.total}>Order Tortal: ${cartTotal}</Text>
			</View>
			<View style={styles.delivery}>
				<TouchableOpacity
					onPress={() => setDeliveryOption("delivery")}
					style={{
						height: "100%",
						backgroundColor:
							deliveryOption === "delivery" ? colors.primary : colors.tile,
						width: "50%",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "row",
					}}
				>
					<View>
						<Text style={styles.option}>Delivery</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.divider}></View>
				<TouchableOpacity
					onPress={() => setDeliveryOption("pickup")}
					style={{
						height: "100%",
						backgroundColor:
							deliveryOption === "pickup" ? colors.primary : colors.tile,
						width: "50%",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "row",
					}}
				>
					<View>
						<Text style={styles.option}>Pick up</Text>
					</View>
				</TouchableOpacity>
			</View>
			<AppButton
				style={styles.btn}
				title="Check Out"
				onPress={continueToPayment}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

		alignItems: "center",
		marginTop: 10,
	},
	btn: {
		width: "80%",
		marginTop: 20,
	},

	delivery: {
		overflow: "hidden",
		width: "95%",
		height: 80,
		borderRadius: 50,
		backgroundColor: colors.tile,
		marginVertical: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		shadowOffset: {
			width: 5,
			height: 5,
		},
		shadowOpacity: 0.7,
		shadowRadius: 10,

		elevation: 10,

		shadowColor: "grey",
	},
	divider: {
		height: "100%",
		width: 2,
		backgroundColor: "grey",
	},
	summary: {
		fontSize: 20,
		fontWeight: "700",
		paddingBottom: 20,
	},
	view: {
		alignItems: "center",
		justifyContent: "center",
		width: "95%",
		height: Dimensions.get("screen").height * 0.3,
		elevation: 10,
		borderRadius: 5,
		shadowColor: "grey",
		shadowOffset: {
			width: 3,
			height: 3,
		},
		padding: 10,
		shadowOpacity: 0.7,
		shadowRadius: 10,
		borderColor: "grey",
		backgroundColor: colors.tile,
	},
	qty: {
		fontSize: 22,
		padding: 5,
	},
	total: {
		fontSize: 35,
		fontWeight: "bold",
		padding: 10,
	},
	option: {
		fontSize: 24,
		fontWeight: "700",
	},
});

export default Checkout;
