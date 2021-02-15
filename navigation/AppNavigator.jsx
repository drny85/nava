import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons, Fontisto } from "@expo/vector-icons";

import Settings from "../screens/profiles/Settings";
import HomeStackNavigator from "./HomeStackNavigator";

import CartNavigator from "./CartNavigator";
import colors from "../config/colors";
import cartContext from "../context/cart/cartContext";

import { EvilIcons } from "@expo/vector-icons";
import ProfileStackNavigator from "./ProfileStackNavigator";
import OrdersStackNavigator from "./OrdersStackNavigator";
import authContext from "../context/auth/authContext";

import * as Notifications from "expo-notifications";
import { COLORS } from "../config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const BottomTabs = createBottomTabNavigator();

const AppNavigator = () => {
  const { cartItems, itemCounts } = useContext(cartContext);
  const { user } = useContext(authContext);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("NOT", notification);
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    <BottomTabs.Navigator
      tabBarOptions={{
        labelStyle: {
          color: COLORS.secondary,
          fontWeight: "600",
        },
        style: {
          backgroundColor: colors.primary,
        },
        inactiveTintColor: COLORS.secondary,
        activeTintColor: COLORS.ascent,
      }}
    >
      <BottomTabs.Screen
        name="Restaurants"
        component={HomeStackNavigator}
        options={{

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-restaurant" size={30} color={color} />
          ),
        }}
      />
      {user && (
        <BottomTabs.Screen

          name="Orders"
          component={OrdersStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="shopping-package" size={30} color={color} />
            ),


          }}
        />
      )}

      <BottomTabs.Screen
        name="CartTab"
        component={CartNavigator}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.cartIcon}>
              <MaterialCommunityIcons name="cart" color={color} size={30} />
              {itemCounts > 0 && (
                <View style={[styles.badge, { backgroundColor: COLORS.ascent }]}>
                  <Text style={{ fontWeight: "700", color: COLORS.tile }}>
                    {itemCounts}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />


      <BottomTabs.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <EvilIcons name="user" size={30} color={color} />
          ),
          title: "Me",
        }}
      />
    </BottomTabs.Navigator>
  );
};

const styles = StyleSheet.create({
  cartIcon: {
    height: "100%",
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {

    width: 22,
    height: 22,
    borderRadius: 50,
    position: "absolute",
    top: -5,
    right: -1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppNavigator;
