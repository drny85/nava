import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons, Fontisto } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";

import CartNavigator from "./CartNavigator";
import cartContext from "../context/cart/cartContext";

import { EvilIcons } from "@expo/vector-icons";
import ProfileStackNavigator from "./ProfileStackNavigator";
import OrdersStackNavigator from "./OrdersStackNavigator";
import authContext from "../context/auth/authContext";

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import * as Notifications from "expo-notifications";
import { COLORS, FONTS } from "../config";

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
          fontWeight: '600'
        },
        style: {
          backgroundColor: COLORS.primary,
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
          options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route)

            return {
              tabBarIcon: ({ color, size }) => (
                <Fontisto name="shopping-package" size={30} color={color} />
              ),

              tabBarVisible: routeName !== 'OrderInTheMaking',
            }


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
                  <Text style={{ ...FONTS.h4, color: COLORS.tile }}>
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

    width: 20,
    height: 20,
    borderRadius: 40,
    position: "absolute",
    top: -2,
    right: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppNavigator;
