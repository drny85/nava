import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";
import Cart from "../screens/Cart";

const CartStack = createStackNavigator();

const CartStackNavigator = () => {
	return (
		<CartStack.Navigator>
			<CartStack.Screen
				name="CartStacks"
				component={Cart}
				options={{
					title: "Cart",
					headerStyle: {
						backgroundColor: colors.primary,
					},
				}}
			/>
		</CartStack.Navigator>
	);
};

export default CartStackNavigator;
