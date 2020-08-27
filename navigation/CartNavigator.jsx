import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import Cart from "../screens/cart/Cart";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import cartContext from "../context/cart/cartContext";
import { Alert } from "react-native";
import Checkout from "../screens/cart/Checkout";
import OrderSummary from "../screens/orders/OrderSummary";
import MyAddress from "../screens/profiles/MyAddress";

const CartStack = createStackNavigator();

const CartStackNavigator = () => {
	const { clearCart, cartItems } = useContext(cartContext);

	const emptyCart = () => {
		Alert.alert("Are yuo sure?", "You want to empty cart", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Yes", onPress: () => clearCart(), style: "default" },
		]);
		//clearCart();
	};

	return (
		<CartStack.Navigator
			screenOptions={{
				headerTintColor: colors.secondary,
				headerStyle: {
					backgroundColor: colors.primary,
				},
			}}
		>
			<CartStack.Screen
				name="Cart"
				component={Cart}
				options={{
					title: "My Cart",

					headerRight: () =>
						cartItems.length > 0 && (
							<MaterialCommunityIcons
								onPress={emptyCart}
								style={{ marginRight: 8 }}
								name="delete"
								size={30}
								color={colors.ascent}
							/>
						),
				}}
			/>
			<CartStack.Screen
				name="OrderSumaary"
				component={OrderSummary}
				options={{ title: "Order Summary" }}
			/>
			<CartStack.Screen
				name="Checkout"
				component={Checkout}
				options={{ title: "Check Out" }}
			/>

			<CartStack.Screen
				name="MyAddress"
				component={MyAddress}
				options={{ title: "My Address", headerBackTitle: "CheckOut" }}
			/>
		</CartStack.Navigator>
	);
};

export default CartStackNavigator;
