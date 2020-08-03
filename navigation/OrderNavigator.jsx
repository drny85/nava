import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OrderConfirmation from "../screens/orders/OrderConfirmation";
import MyOrders from "../screens/orders/MyOrders";
import OrderVerification from "../screens/orders/OrderVerification";

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
			<OrdersStack.Screen name="OrderVerification" component={OrderVerification} />
		</OrdersStack.Navigator>
	);
};

export default OrderNavigator;
