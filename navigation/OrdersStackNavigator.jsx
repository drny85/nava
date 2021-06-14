import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import MyOrders from "../screens/orders/MyOrders";
import OrderConfirmation from "../screens/orders/OrderConfirmation";
import OrderSummary from "../screens/orders/OrderSummary";
import OrderVerification from "../screens/orders/OrderVerification";
import { useNavigation } from "@react-navigation/native";
import OrderDetails from "../screens/orders/OrderDetails";
import OrderInTheMaking from "../screens/orders/OrderInTheMaking";
import { COLORS, FONTS } from "../config";

const OrdersStack = createStackNavigator();

const OrdersStackNavigator = ({ route }) => {


  const navigation = useNavigation();
  return (
    <OrdersStack.Navigator mode="modal" initialRouteName="MyOrders">
      <OrdersStack.Screen
        name="MyOrders"
        component={MyOrders}

        options={{ title: "My Orders", headerLeft: null }}
      />
      <OrdersStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ title: "Confirmation", headerLeft: null }}
      />
      {/* <OrdersStack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{
          title: "Order Summary",
          headerTitleStyle: { fontFamily: "montserrat-bold" },
        }}
      /> */}
      <OrdersStack.Screen
        name="OrderInTheMaking"
        component={OrderInTheMaking}
        options={{
          headerShown: false,
          headerTitleStyle: { ...FONTS.h3 },
        }}
      />
      <OrdersStack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          title: "Order Details",
          headerTitleStyle: { ...FONTS.h3 },
        }}
      />
      <OrdersStack.Screen
        name="OrderVerification"
        component={OrderVerification}

        options={{

          headerShown: null,
          unmountOnBlur: true,

        }}
      />
    </OrdersStack.Navigator>
  );
};

export default OrdersStackNavigator;
