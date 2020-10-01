// @ts-nocheck
import React, { useContext, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableWithoutFeedback,
	Alert,
} from "react-native";
import AppButton from "../../components/AppButton";
import cartContext from "../../context/cart/cartContext";
import colors from "../../config/colors";
import CartItemTile from "../../components/CartItemTile";

import authContext from "../../context/auth/authContext";
import settingsContext from "../../context/settings/settingsContext";
import Loader from "../../components/Loader";

const MINIMUM = 10

const Cart = ({ navigation }) => {
	const {
		cartItems,
		getCartItems,
		loading,
		addToCart,
		cartTotal,
		itemCounts,
		deleteFromCart,
	} = useContext(cartContext);
	const { user } = useContext(authContext);
	const { setRoute, clearSettings } = useContext(settingsContext);

	const continueToCheckOut = () => {
		if (cartTotal < MINIMUM) {
			Alert.alert(
				"Opsss",
				`Please make a purchase greater than $${MINIMUM}. You are just $${(
					MINIMUM - cartTotal
				).toFixed(2)} away`,
				[{ text: "OK", style: "cancel" }]
			);

			return;
		}
		if (!user) {
			setRoute("Checkout");
			navigation.navigate("Profile", { screen: "Login" });
			return;
		}

		navigation.navigate("Checkout", {
			cart: { cartItems, cartTotal, itemCounts },
		});
	};

	useEffect(() => {
		getCartItems();
	}, []);

	if (loading) return <Loader />;

	return (
		<View style={styles.container}>
			{cartItems.length > 0 ? (
				<FlatList
					style={{ flex: 1, marginTop: 10 }}
					data={cartItems}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<CartItemTile
							isDisable={loading}
							onRemove={() => deleteFromCart(item)}
							onAddMore={() => addToCart(item)}
							item={item}
						/>
					)}
				/>
			) : (
					<View style={styles.noItems}>
						<Text>No Items in cart</Text>
						<AppButton
							title="Start Shopping"
							style={{ marginTop: 20, paddingHorizontal: 20 }}
							textStyle={{ fontSize: 16, fontWeight: "600", }}
							onPress={() => navigation.navigate("Home")}
						/>
					</View>
				)}

			{cartTotal > 0 && (
				// <TouchableWithoutFeedback onPress={continueToCheckOut}>
				//   <View style={styles.cartTotalView}>
				//     <Text style={styles.text}>Checkout: ${cartTotal}</Text>
				//   </View>
				// </TouchableWithoutFeedback>
				<AppButton
					style={{
						marginBottom: 8,
						width: "95%",
						backgroundColor: colors.primary,
					}}
					title={`Checkout: $${cartTotal.toFixed(2)}`}
					onPress={continueToCheckOut}
				/>
			)}
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
		backgroundColor: colors.primary,

	},

	cartTotalView: {
		height: 60,
		width: "100%",
		backgroundColor: colors.ascent,
		justifyContent: "center",
		alignItems: "center",
	},

	text: {
		fontSize: 28,
		fontWeight: "bold",
		color: colors.secondary,
	},
	noItems: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Cart;
