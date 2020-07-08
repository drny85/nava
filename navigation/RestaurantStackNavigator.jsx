import React from "react";
import { View, Text, Button } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";

import Restaurants from "../screens/Restaurants";
import colors from "../config/colors";

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
                    backgroundColor: colors.primary
                   },
					headerRight: () => (
						<MaterialCommunityIcons
							name="filter-variant"
							style={{ marginRight: 8 }}
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
