import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import authContext from "../context/auth/authContext";
import Signup from "../screens/profiles/Signup";
import Signin from "../screens/profiles/Signin";
import settingsContext from "../context/settings/settingsContext";
import Profile from "../screens/profiles/Profile";
import MyAddress from "../screens/profiles/MyAddress";

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
	const { logout, user } = React.useContext(authContext);
	const { clearSettings } = React.useContext(settingsContext);

	const handleLogout = () => {
		logout();
		clearSettings();
	};
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen
				name="Profile"
				component={Profile}
				options={{
					headerTitleStyle: { fontFamily: "montserrat-bold" },
					title: user ? user.name : "Profile",
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
				name="MyAddress"
				component={MyAddress}
				options={{ title: "My Address" }}
			/>
			<ProfileStack.Screen name="Signin" component={Signin} />
			<ProfileStack.Screen name="Signup" component={Signup} />
		</ProfileStack.Navigator>
	);
};

export default ProfileStackNavigator;
