import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import Profile from "../screens/Profile";
import colors from "../config/colors";
import authContext from "../context/auth/authContext";
import Signup from "../screens/Signup";
import Signin from "../screens/Signin";
import settingsContext from "../context/settings/settingsContext";
import OrderConfirmation from "../screens/OrderConfirmation";
import MyOrders from "../screens/MyOrders";

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
