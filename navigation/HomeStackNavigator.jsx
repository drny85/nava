// @ts-nocheck
import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import ProductDetail from "../screens/ProductDetail";

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
	return (
		<HomeStack.Navigator mode="modal">
			<HomeStack.Screen
				name="Home"
				component={Home}
				options={{ header: () => null }}
			/>
			<HomeStack.Screen
				name="ProductDetail"
				component={ProductDetail}
				options={({ route }) => ({ title: route.params.routeName , headerShown: false})}
			/>
		</HomeStack.Navigator>
	);
};

export default HomeStackNavigator;
