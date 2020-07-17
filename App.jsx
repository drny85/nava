import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import ItemsState from "./context/items/itemsState";
import CategoryState from "./context/category/categoryState";
import CartState from "./context/cart/cartState";

export default function App() {
	return (
		<ItemsState>
			<CategoryState>
				<CartState>
					<NavigationContainer>
						<AppNavigator />
					</NavigationContainer>
				</CartState>
			</CategoryState>
		</ItemsState>
	);
}
