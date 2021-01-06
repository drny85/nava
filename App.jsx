// @ts-nocheck
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import ItemsState from "./context/items/itemsState";
import CategoryState from "./context/category/categoryState";
import CartState from "./context/cart/cartState";
import OrdersState from "./context/order/orderState";
import AuthState from "./context/auth/authState";
import { AppLoading } from "expo";
import authContext from "./context/auth/authContext";
import SettingsState from "./context/settings/settingsState";
import * as Font from "expo-font";
import navigationTheme from "./navigation/navigationTheme";
import StoresState from "./context/stores/storesState";

const loadFonts = () => {
	return Font.loadAsync({
		montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
		"montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
		"montserrat-bold-italic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
		"tangerine": require('./assets/fonts/Tangerine-Regular.ttf'),
		"tangerine-bold": require('./assets/fonts/Tangerine-Bold.ttf'),
	});
}

const App = () => {
	const [isReady, setIsReady] = React.useState(false);
	const { getCurrentUser, authUnsubcribe } = React.useContext(authContext);

	React.useEffect(() => {
		return () => {
			console.log("Unsubcribing user");
			authUnsubcribe();
		};
	}, []);

	if (!isReady) {
		loadFonts();
		return (
			<AppLoading
				startAsync={getCurrentUser}
				onFinish={() => setIsReady(true)}
			/>
		);
	}

	return (
		<StoresState>
			<ItemsState>
				<SettingsState>
					<CategoryState>
						<CartState>
							<OrdersState>
								<NavigationContainer theme={navigationTheme}>
									<AppNavigator />
								</NavigationContainer>
							</OrdersState>
						</CartState>
					</CategoryState>
				</SettingsState>
			</ItemsState>
		</StoresState>
	);
};

export default () => {
	return (
		<AuthState>
			<App />
		</AuthState>
	);
};
