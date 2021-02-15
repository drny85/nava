import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import authContext from "../context/auth/authContext";
import Signup from "../screens/profiles/Signup";
import Signin from "../screens/profiles/Signin";
import settingsContext from "../context/settings/settingsContext";
import Profile from "../screens/profiles/Profile";
import MyAddress from "../screens/profiles/MyAddress";
import MyFavorites from "../screens/profiles/MyFavorites";

import { CommonActions } from "@react-navigation/native";
import { COLORS } from "../config";
import { color } from "react-native-reanimated";
import MyOrders from "../screens/orders/MyOrders";

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = ({ navigation }) => {
  const { logout, user } = React.useContext(authContext);
  const { clearSettings } = React.useContext(settingsContext);

  const clearAll = () => {
    logout();
    clearSettings();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Cart" }],
      })
    );
  };

  const handleLogout = () => {
    Alert.alert("Signing Out", "Do you want to log out?", [
      { text: "Yes", onPress: clearAll },
      { text: "No", style: "cancel" },
    ]);
  };
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitleStyle: { fontFamily: "montserrat-bold", fontSize: 16 },
          title: user ? user.name : "Profile",

          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={handleLogout}
            >
              {user && (
                <Text style={{ color: COLORS.secondary, fontWeight: "700" }}>
                  Log Out
                </Text>
              )}
            </TouchableOpacity>
          ),
          headerShown: user && true,
          headerBackTitleStyle: { color: COLORS.secondary }
        }}
      />
      <ProfileStack.Screen
        name="MyAddress"
        component={MyAddress}
        options={{ title: "My Addresses", headerBackTitle: "Profile", headerBackTitleStyle: { color: COLORS.secondary } }}
      />
      <ProfileStack.Screen name="Favorites" component={MyFavorites} options={{ headerBackTitleStyle: { color: COLORS.secondary } }} />
      <ProfileStack.Screen name="Signin" component={Signin} />
      <ProfileStack.Screen name="MyOrders" component={MyOrders} options={{ title: 'My Orders', headerBackTitleStyle: { color: COLORS.secondary }, headerBackTitle: null }} />
      <ProfileStack.Screen name="Signup" component={Signup} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
