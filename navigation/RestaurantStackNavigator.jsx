import React from "react";
import { View, Text, Button } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

import Restaurants from "../screens/Restaurants";

const RestaurantStack = createStackNavigator();

const RestaurantStackNavigator = () => {
	return (
		<RestaurantStack.Navigator>
			<RestaurantStack.Screen
				name="RestaurantStacks"
				component={Restaurants}
				options={{
                    
                    title: "Restaurants",
                   headerStyle: {
                    backgroundColor: '#DC2A10'
                   },
					headerRight: () => (
						<MaterialCommunityIcons
							name="filter-variant"
							style={{ marginRight: 10 }}
							size={30}
							onPress={() => {
								console.log("PRESEED");
							}}
						/>
					),
				}}
			/>
		</RestaurantStack.Navigator>
	);
};

export default RestaurantStackNavigator;
