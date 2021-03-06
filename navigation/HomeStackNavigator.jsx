// @ts-nocheck
import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
// import { createStackNavigator } from "@react-navigation/stack";
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';


import { enableScreens } from 'react-native-screens'

import cartContext from "../context/cart/cartContext";
import Home from "../screens/home/Home";
import ProductDetail from "../screens/home/ProductDetail";
import Restaurants from "../screens/home/Restaurants";
import { COLORS, FONTS, SIZES } from "../config";

enableScreens()

const HomeStack = createSharedElementStackNavigator();

const HomeStackNavigator = () => {
  const { getCartItems } = useContext(cartContext);

  useEffect(() => {
    getCartItems();

  }, []);
  return (
    <HomeStack.Navigator mode="modal">
      <HomeStack.Screen name='Restaurants' options={{ headerTitle: () => <View><Text style={styles.text}>My Deli</Text></View>, headerShown: false, }} component={Restaurants} />

      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{

          headerShown: false,
          headerBackground: () => (
            <View
              style={{
                backgroundColor: COLORS.primary,

              }}
            ></View>
          ),
        }}
      />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={({ route }) => ({ headerShown: false })}
      />
    </HomeStack.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 28, fontFamily: 'tange'
  }

})

export default HomeStackNavigator;
