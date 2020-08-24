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

const loadFonts = () => {
  return Font.loadAsync({
    montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-bold-italic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
  });
};

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
    <ItemsState>
      <SettingsState>
        <CategoryState>
          <CartState>
            <OrdersState>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </OrdersState>
          </CartState>
        </CategoryState>
      </SettingsState>
    </ItemsState>
  );
};

export default () => {
  return (
    <AuthState>
      <App />
    </AuthState>
  );
};
