import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import ItemsState from "./context/items/itemsState";
import CategoryState from "./context/category/categoryState";

export default function App() {
	return (
		<ItemsState>
			<CategoryState>
				<NavigationContainer>
					<AppNavigator />
				</NavigationContainer>
			</CategoryState>
		</ItemsState>
	);
}
