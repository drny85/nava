import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../config/colors";

import MyOrders from "../screens/orders/MyOrders";
import OrderConfirmation from "../screens/orders/OrderConfirmation";
import OrderSummary from "../screens/orders/OrderSummary";
import OrderVerification from "../screens/orders/OrderVerification";

const OrdersStack = createStackNavigator();

const OrdersStackNavigator = () => {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{ title: "My Orders" }}
      />
      <OrdersStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ title: "Confirmation" }}
      />
      <OrdersStack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{ title: null }}
      />
      <OrdersStack.Screen
        name="OrderVerification"
        component={OrderVerification}
        options={{
          title: "Verification",
          headerLeft: () => <Ionicons color={colors.primary} size={30} />,
        }}
      />
    </OrdersStack.Navigator>
  );
};

export default OrdersStackNavigator;
