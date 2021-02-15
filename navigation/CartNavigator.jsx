import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import Cart from "../screens/cart/Cart";

import Checkout from "../screens/cart/Checkout";
import OrderSummary from "../screens/orders/OrderSummary";
import MyAddress from "../screens/profiles/MyAddress";
import { COLORS } from "../config";

const CartStack = createStackNavigator();

const CartStackNavigator = ({ navigation }) => {
  return (
    <CartStack.Navigator

      screenOptions={{
        headerTintColor: COLORS.secondary,
      }}
    >
      <CartStack.Screen
        name="Cart"
        component={Cart}
        options={{
          title: "My Cart",
        }}
      />
      <CartStack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{ title: "Order Summary" }}
      />
      <CartStack.Screen
        name="Checkout"
        component={Checkout}
        options={{ title: "Check Out" }}
      />

      <CartStack.Screen
        name="MyAddress"
        component={MyAddress}
        options={{ title: "My Address", headerBackTitle: "CheckOut" }}
      />
    </CartStack.Navigator>
  );
};

export default CartStackNavigator;
