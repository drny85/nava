// @ts-nocheck
import React, { useContext, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Alert,
	Modal,
	ScrollView,
	Dimensions,
} from "react-native";

import authContext from "../context/auth/authContext";
import Screen from "../components/Screen";

import Order from "../models/Order";
import AppSubmitButton from "../components/AppSubmitButton";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import cartContext from "../context/cart/cartContext";
import OrdersState from "../context/order/orderState";
import ordersContext from "../context/order/orderContext";
import AppButton from "../components/AppButton";

const Payment = ({ navigation, route }) => {
	const { user } = useContext(authContext);
	const [isVisible, setIsVisible] = useState(false);
	const { placeOrder } = useContext(ordersContext);
	const { cartItems, cartTotal, itemCounts, clearCart, loading } = useContext(
		cartContext
	);
	//const { deliveryMethod } = useContext(settingsContext);
	const { deliveryMethod, customer, paymentMethod } = route.params;

	if (!user) {
		navigation.navigate("Profile", {
			previewRoute: "Payment",
		});
	}

	const handlePayment = async () => {
		try {
			const order = new Order(
				cartItems,
				customer,
				deliveryMethod,
				cartTotal,
				paymentMethod
			);
			if (cartItems.length > 0) {
				await placeOrder(order);

				clearCart();
				setIsVisible(true);
				//navigation.replace("OrderConfirmation");
			} else {
				Alert.alert("Empty Cart", "Cart is empty", [
					{ text: "OK", style: "cancel" },
				]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Screen style={styles.container}>
			<Modal
				visible={isVisible}
				animationType="slide"
				transparent={true}
				onDismiss={() => navigation.navigate("CartStacks")}
			>
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
						flex: 1,
						backgroundColor: "grey",
					}}
				>
					<Text>Your order has been placed</Text>
					<AppButton title="Close" onPress={() => setIsVisible(false)} />
				</View>
			</Modal>

			<View style={styles.listView}>
				<FlatList
					data={cartItems}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<ListItem
							name={item.name}
							imageUrl={item.imageUrl}
							qty={item.quantity}
							price={item.price}
						/>
					)}
				/>
			</View>
			<ScrollView style={styles.details}>
				{deliveryMethod === "pickup" ? (
					<>
						<Text
							style={{
								fontSize: 20,
								fontStyle: "italic",
								fontWeight: "800",
								marginBottom: 20,
							}}
						>
							Important information about your order {customer.name}
						</Text>
						<Text style={styles.title}>
							You will be picking up this order at the restaurant
						</Text>
					</>
				) : (
					<>
						<View>
							<Text style={styles.title}>
								Your order will be delivered to this address:
							</Text>

							<View style={styles.addressView}>
								<Text style={styles.address}>
									{customer.address} {customer.apt ? customer.apt : null}
								</Text>
								<Text style={styles.address}>
									{customer.city}, {customer.zipcode}
								</Text>
								<Text style={styles.title}>You might be contacted at:</Text>
								<Text style={styles.address}>Phone: {customer.phone}</Text>
								<Text style={styles.address}>Email: {customer.email}</Text>
							</View>
						</View>
					</>
				)}
				{paymentMethod === "cash" && deliveryMethod === "pickup" && (
					<Text>Here</Text>
				)}
				{paymentMethod === "in store" && deliveryMethod === "pickup" && (
					<View style={styles.pickup}>
						<Text style={styles.title}>
							You will pay for this order at the store
						</Text>
						<Text style={styles.title}>
							You can pay with cash or credit / debit card
						</Text>
						<View style={styles.totalView}>
							<Text style={styles.title}>Order Total</Text>
							<Text style={{ fontWeight: "bold", fontSize: 45 }}>
								${cartTotal}
							</Text>
						</View>
					</View>
				)}
				{paymentMethod === "cash" && deliveryMethod === "delivery" && (
					<View style={styles.infoView}>
						<Text style={styles.infotext}>
							Your order total is ${cartTotal}, please have this amount
							available in cash. Always be generous and tip the delivery guy.
						</Text>
					</View>
				)}
				{paymentMethod === "credit" && deliveryMethod === "delivery" && (
					<Text>Delivery option with credit</Text>
				)}
			</ScrollView>
			<View style={{ position: "absolute", bottom: 5, width: "100%" }}>
				<AppButton title="Place Order" onPress={handlePayment} />
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		marginHorizontal: 10,
	},
	listView: {
		backgroundColor: "blue",
		maxHeight: Dimensions.get("screen").height * 0.3,
	},
	details: {
		flex: 2,
		padding: 10,
	},

	addressView: {},

	title: {
		fontWeight: "600",
		fontSize: 16,
		marginVertical: 10,
	},
	address: {
		fontSize: 16,
	},

	infoView: {
		width: "100%",
		marginTop: 20,
		shadowOffset: {
			width: 5,
			height: 7,
		},
		shadowOpacity: 0.7,
		shadowColor: "grey",
		paddingTop: 5,
		elevation: 10,
		shadowRadius: 2,
	},
	infotext: {
		fontSize: 20,
		fontWeight: "600",
	},
	pickup: {},
	totalView: {
		padding: 20,
		marginTop: 30,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Payment;
