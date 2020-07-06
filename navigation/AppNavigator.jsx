import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import Home from "../screens/Home";
import Settings from "../screens/Settings";
import HomeStackNavigator from "./HomeStackNavigator";
import RestaurantStackNavigator from "./RestaurantStackNavigator";


const BottomTabs = createBottomTabNavigator();

const AppNavigator = () => {
	return (
		<BottomTabs.Navigator>
			<BottomTabs.Screen name="Home" component={HomeStackNavigator}  options={{tabBarIcon: ({color, size}) => (<MaterialCommunityIcons name="home-outline" color={color} size={30} />)}} />
            <BottomTabs.Screen name="Restaurants" component={RestaurantStackNavigator} options={{tabBarIcon: ({color, size}) => (<Ionicons name="ios-restaurant" color={color} size={30} />)}} />
			<BottomTabs.Screen name="Settings" component={Settings} options={{tabBarIcon: ({color, size}) => (<Ionicons name="ios-settings" color={color} size={30} />)}}  />

		</BottomTabs.Navigator>
	);
};

export default AppNavigator;
