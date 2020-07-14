// @ts-nocheck
import React, { useEffect, useContext } from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import ProductDetail from "../screens/ProductDetail";
import colors from "../config/colors";

import cartContext from "../context/cart/cartContext";

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
	const { getCartItems } = useContext(cartContext);

	useEffect(() => {
		getCartItems();
	}, []);
	return (
		<HomeStack.Navigator mode="modal">
			<HomeStack.Screen
				name="Home"
				component={Home}
				options={{
					title: null,
					headerShown: null,
				}}
			/>
			<HomeStack.Screen
				name="ProductDetail"
				component={ProductDetail}
				options={({ route }) => ({ headerShown: false })}
			/>
		</HomeStack.Navigator>
	);
};

export default HomeStackNavigator;
