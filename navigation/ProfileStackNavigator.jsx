import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import authContext from "../context/auth/authContext";

import settingsContext from "../context/settings/settingsContext";
import OrderConfirmation from "../screens/orders/OrderConfirmation";
import MyOrders from "../screens/orders/MyOrders";
import Signin from "../screens/profiles/Signin";
import Signup from "../screens/profiles/Signup";
import Profile from "../screens/profiles/Profile";

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
	const { logout, user } = React.useContext(authContext);
	const { clearSettings } = React.useContext(settingsContext);

	const handleLogout = () => {
		logout();
		clearSettings();
	};
	return (
		<ProfileStack.Navigator mode="modal">
			<ProfileStack.Screen
				name="Profile"
				component={Profile}
				options={{
					headerRight: () => (
						<TouchableOpacity
							style={{ marginRight: 10 }}
							onPress={handleLogout}
						>
							{user && (
								<Text style={{ color: colors.primary, fontWeight: "700" }}>
									Log Out
								</Text>
							)}
						</TouchableOpacity>
					),
					headerShown: user && true,
				}}
			/>
			<ProfileStack.Screen
				name="OrderConfirmation"
				component={OrderConfirmation}
				options={{ headerShown: null }}
			/>
			<ProfileStack.Screen
				name="MyOrders"
				component={MyOrders}
				options={{ title: "My Orders" }}
			/>
			<ProfileStack.Screen name="Signin" component={Signin} />
			<ProfileStack.Screen name="Signup" component={Signup} />
		</ProfileStack.Navigator>
	);
};

export default ProfileStackNavigator;
