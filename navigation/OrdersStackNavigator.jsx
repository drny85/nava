import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../config/colors";

import MyOrders from "../screens/orders/MyOrders";
import OrderConfirmation from "../screens/orders/OrderConfirmation";
import OrderSummary from "../screens/orders/OrderSummary";
import OrderVerification from "../screens/orders/OrderVerification";
import { useNavigation } from "@react-navigation/native";

const OrdersStack = createStackNavigator();

const OrdersStackNavigator = () => {
	const navigation = useNavigation();
	return (
		<OrdersStack.Navigator>
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
			<OrdersStack.Screen
				name="OrderSummary"
				component={OrderSummary}
				options={{ title: "Order Summary" }}
			/>
			<OrdersStack.Screen
				name="OrderVerification"
				component={OrderVerification}
				options={{
					title: "Verification",
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
