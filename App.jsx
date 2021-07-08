// @ts-nocheck
import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import ItemsState from "./context/items/itemsState";
import CategoryState from "./context/category/categoryState";
import CartState from "./context/cart/cartState";
import OrdersState from "./context/order/orderState";
import AuthState from "./context/auth/authState";
import AppLoading from 'expo-app-loading'
import authContext from "./context/auth/authContext";
import SettingsState from "./context/settings/settingsState";
import navigationTheme from "./navigation/navigationTheme";
import StoresState from "./context/stores/storesState";

import { useFonts } from '@expo-google-fonts/montserrat'



const App = () => {
  const { getCurrentUser } = React.useContext(authContext);
  const [fontsLoaded] = useFonts({
    montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-bold-italic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    "lobster": require('./assets/fonts/Lobster-Regular.ttf'),
    "tange": require("./assets/fonts/Tangerine-Regular.ttf"),

  })

  console.log('MAIN_APP')

  useEffect(() => {
    console.log('MAIN_APP_USE_EFFECT')
    getCurrentUser()
    return () => {

      //sub && sub()
    }

  }, [])

  if (!fontsLoaded) {
    //getCurrentUser();
    return <AppLoading autoHideSplash={true} />
  }

  return (
    <StoresState>
      <ItemsState>
        <SettingsState>
          <CategoryState>
            <CartState>
              <OrdersState>
                <NavigationContainer theme={navigationTheme}>
                  <AppNavigator />
                </NavigationContainer>
              </OrdersState>
            </CartState>
          </CategoryState>
        </SettingsState>
      </ItemsState>
    </StoresState>
  );
};

export default () => {
  return (
    <AuthState>
      <App />
    </AuthState>
  );
};
