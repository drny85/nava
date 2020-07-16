import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppButton from "../components/AppButton";
import { db } from "../services/database";
import cartContext from "../context/cart/cartContext";

const Checkout = ({ route }) => {
	const {
		cart: { cartItems, cartTotal, itemCounts },
    } = route.params;
    
    const {clearCart} =useContext(cartContext);

	const handleCheckOut = async () => {
		const data = await db.collection("orders").add({
			customer: {
				address: {
					street: "1830 morris ave",
					apt: "6c",
					city: "bronx",
					zipcode: "10456",
				},
				email: "maria.m@aol.com",
				name: "joel",
				lastName: "lopez",
				phone: "347-222-2222",
			},
			items: [...cartItems],
			orderPlaced: new Date().toISOString(),
			status: "new",
			totalAmount: cartTotal,
			orderNumber: 3,
		});

		if (data.id) {
            console.log('clearCart');
            clearCart();
        }
	};

	return (
		<View style={styles.container}>
			<AppButton
				style={styles.btn}
				title="Check Out"
				onPress={handleCheckOut}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	btn: {
		width: "80%",
	},
});

export default Checkout;
