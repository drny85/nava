import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import colors from "../config/colors";

import MyOrders from "../screens/orders/MyOrders";
import OrderConfirmation from "../screens/orders/OrderConfirmation";
import OrderSummary from "../screens/orders/OrderSummary";
import OrderVerification from "../screens/orders/OrderVerification";
import { useNavigation } from "@react-navigation/native";
import OrderDetails from "../screens/orders/OrderDetails";
import OrderInTheMaking from "../screens/orders/OrderInTheMaking";

const OrdersStack = createStackNavigator();

const OrdersStackNavigator = ({ route }) => {
  const previous = route.params;

  const navigation = useNavigation();
  return (
    <OrdersStack.Navigator mode="modal">
      <OrdersStack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{ title: "My Orders", headerLeft: previous && (() => <AntDesign name='arrowleft' onPress={() => navigation.goBack()} size={30} style={{ paddingLeft: 10 }} />) }}
      />
      <OrdersStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{ title: "Confirmation", headerLeft: null }}
      />
      <OrdersStack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{
          title: "Order Summary",
          headerTitleStyle: { fontFamily: "montserrat-bold" },
        }}
      />
      <OrdersStack.Screen
        name="OrderInTheMaking"
        component={OrderInTheMaking}
        options={{
          headerShown: false,
          headerTitleStyle: { fontFamily: "montserrat-bold" },
        }}
      />
      <OrdersStack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          title: "Order Details",
          headerTitleStyle: { fontFamily: "montserrat-bold" },
        }}
      />
      <OrdersStack.Screen
        name="OrderVerification"
        component={OrderVerification}
        options={{
          title: "Payment",
          headerTitleStyle: { fontFamily: "montserrat-bold" },
          headerLeft: () => (
            <TouchableWithoutFeedback
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons
                style={{ marginLeft: 10 }}
                name="md-arrow-back"
                color={colors.primary}
                size={30}
              />
            </TouchableWithoutFeedback>
          ),
        }}
      />
    </OrdersStack.Navigator>
  );
};

export default OrdersStackNavigator;
