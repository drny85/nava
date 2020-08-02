import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OrderConfirmation from "../screens/OrderConfirmation";

const ConfirmationStack = createStackNavigator();

const ConfirmationScreen = () => {
	return (
		<ConfirmationStack.Navigator>
			<ConfirmationStack.Screen
				name="ConfirmationScreen"
				component={OrderConfirmation}
				options={({ route }) => ({ headerShown: false })}
			/>
		</ConfirmationStack.Navigator>
	);
};

export default ConfirmationScreen;
