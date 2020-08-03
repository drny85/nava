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
import colors from "./config/colors";

const App = () => {
  const [isReady, setIsReady] = React.useState(false);
  const { getCurrentUser } = React.useContext(authContext);

  if (!isReady)
    return (
      <AppLoading
        startAsync={getCurrentUser}
        onFinish={() => setIsReady(true)}
      />
    );
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
