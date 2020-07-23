import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import ItemsState from "./context/items/itemsState";
import CategoryState from "./context/category/categoryState";
import CartState from "./context/cart/cartState";
import OrdersState from "./context/order/orderState";
import AuthState from "./context/auth/authState";
import { AppLoading } from "expo";

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const logingUser = () => {
    console.log("Logging IN");
  };
  if (!isReady)
    return (
      <AppLoading startAsync={logingUser} onFinish={() => setIsReady(true)} />
    );
  return (
    <AuthState>
      <ItemsState>
        <CategoryState>
          <CartState>
            <OrdersState>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </OrdersState>
          </CartState>
        </CategoryState>
      </ItemsState>
    </AuthState>
  );
}
