import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import Cart from "../screens/Cart";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import cartContext from "../context/cart/cartContext";
import { Alert } from "react-native";
import Checkout from "../screens/Checkout";

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
		<CartStack.Navigator>
			<CartStack.Screen
				name="CartStacks"
				component={Cart}
				options={{
					title: "Your Order",
					headerStyle: {
						backgroundColor: colors.primary,
					},
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
				name="Checkout"
				component={Checkout}
				options={{ title: "Check Out" }}
			/>
		</CartStack.Navigator>
	);
};

export default CartStackNavigator;
