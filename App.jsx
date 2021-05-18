// @ts-nocheck
import React, { useCallback } from "react";

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
import * as Font from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import navigationTheme from "./navigation/navigationTheme";
import StoresState from "./context/stores/storesState";

import logger from './utils/logger'


const loadFonts = async () => {
  return await Font.loadAsync({
    montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    monte: require("./assets/fonts/Montez-Regular.ttf"),
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-bold-italic": require("./assets/fonts/Montserrat-BoldItalic.ttf"),
    "lobster": require('./assets/fonts/Lobster-Regular.ttf'),
    tange: require("./assets/fonts/Tangerine-Regular.ttf"),
  });
};

const App = () => {
  const [isReady, setIsReady] = React.useState(false);
  const { getCurrentUser } = React.useContext(authContext);


  const onLayoutRootView = useCallback(async () => {
    if (isReady) {

      await SplashScreen.hideAsync();
    }
  }, [isReady]);


  React.useEffect(() => {


    (async () => {

      try {
        await SplashScreen.preventAutoHideAsync()
        await loadFonts()
        getCurrentUser()

      } catch (error) {
        console.log('Error @App.js', error)
      } finally {
        setIsReady(true)
      }

    })()

    onLayoutRootView()

  }, [isReady]);

  if (!isReady) {

    <AppLoading />
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
