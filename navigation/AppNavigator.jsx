import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import Settings from "../screens/Settings";
import HomeStackNavigator from "./HomeStackNavigator";
import RestaurantStackNavigator from "./RestaurantStackNavigator";
import CartNavigator from "./CartNavigator";
import colors from "../config/colors";
import cartContext from "../context/cart/cartContext";

const BottomTabs = createBottomTabNavigator();

const AppNavigator = () => {
	const { cartItems, itemCounts } = useContext(cartContext);

	return (
		<BottomTabs.Navigator
			tabBarOptions={{
				labelStyle: {
					color: "black",
					fontWeight: "600",
				},
				style: {
					backgroundColor: colors.primary,
				},
				inactiveTintColor: "#333",
			}}
		>
			<BottomTabs.Screen
				name="Home"
				component={HomeStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="home-outline"
							color={color}
							size={30}
						/>
					),
				}}
			/>
			<BottomTabs.Screen
				name="Restaurants"
				component={RestaurantStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-restaurant" color={color} size={30} />
					),
				}}
			/>
			<BottomTabs.Screen
				name="Cart"
				component={CartNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<View style={styles.cartIcon}>
							<MaterialCommunityIcons name="cart" color={color} size={30} />
							<View style={styles.badge}>
								<Text style={{ fontWeight: "700" }}>{itemCounts}</Text>
							</View>
						</View>
					),
				}}
			/>
			<BottomTabs.Screen
				name="Settings"
				component={Settings}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-settings" color={color} size={30} />
					),
				}}
			/>
		</BottomTabs.Navigator>
	);
};

const styles = StyleSheet.create({
	cartIcon: {
		height: "100%",
		width: "50%",
		alignItems: "center",
		justifyContent: "center",
	},
	badge: {
		backgroundColor: "grey",
		width: 25,
		height: 25,
		borderRadius: 50,
		position: "absolute",
		top: -5,
		right: -5,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default AppNavigator;
