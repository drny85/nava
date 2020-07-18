import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import ItemsState from "./context/items/itemsState";
import CategoryState from "./context/category/categoryState";
import CartState from "./context/cart/cartState";
import OrdersState from "./context/order/orderState";

export default function App() {
  return (
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
  );
}
