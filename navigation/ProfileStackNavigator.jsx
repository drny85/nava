import React from "react";
import {Text, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import colors from "../config/colors";
import authContext from "../context/auth/authContext";

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {

    const {logout, user} = React.useContext(authContext)
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen name="Me" component={Profile} options={
                
                {headerRight: () => (
                   
                    <TouchableOpacity style={{marginRight: 10}} onPress={logout}>
                         {user && (<Text style={{color: colors.secondary}}>Log Out</Text>)}
                    </TouchableOpacity>
                  

                ), headerShown: user && true}
            } />
		</ProfileStack.Navigator>
	);
};

export default ProfileStackNavigator;
