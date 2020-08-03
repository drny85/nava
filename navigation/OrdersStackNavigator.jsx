import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import OrderConfirmation from "../screens/orders/OrderConfirmation";
import MyOrders from "../screens/orders/MyOrders";
import OrderVerification from "../screens/orders/OrderVerification";
import colors from "../config/colors";
import OrderSummary from "../screens/orders/OrderSummary";

const OrdersStack = createStackNavigator();

const OrderNavigator = () => {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="MyOrders"
        component={MyOrders}
        options={({ route }) => ({ title: "My Orders" })}
      />
      <OrdersStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ title: "Confirmation" }}
      />
      <CartStack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{ title: null }}
      />
      <OrdersStack.Screen
        name="OrderVerification"
        component={OrderVerification}
        options={{
          title: null,
          headerLeft: () => <Ionicons color={colors.primary} size={30} />,
        }}
      />
    </OrdersStack.Navigator>
  );
};

export default OrderNavigator;
