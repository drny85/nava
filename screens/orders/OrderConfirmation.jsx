// @ts-nocheck
import React, { useEffect, useState } from "react";
import { StyleSheet, Modal } from "react-native";

import { CommonActions } from "@react-navigation/native"

import Screen from "../../components/Screen";

import LottieView from 'lottie-react-native'
import { COLORS } from "../../config";


const OrderConfirmation = ({ navigation, route }) => {
  const { order } = route.params;

  const [isVisible, setIsVisible] = useState(true);

  const resetCartNavigation = async () => {

    try {

      setIsVisible(false)
      const success = await resetNavigationState()

      if (success) {
        navigation.navigate("Orders", {
          screen: "OrderInTheMaking",
          params: { order },
        });
      }


    } catch (error) {
      console.log('Error resetting nav', error)
    }

  };

  const resetNavigationState = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'CartTab' },

        ],
      })
    );

    return true;
  }


  return (
    <Screen style={styles.screen}>
      <Modal
        visible={isVisible}
        animationType="slide"

      >
        <LottieView
          loop={false}
          autoPlay
          colorFilters={[
            { keypath: "Sending Loader", color: COLORS.secondary },
          ]}
          onAnimationFinish={resetCartNavigation}
          source={require("../../assets/animations/done.json")}
        />
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {

    justifyContent: "center",
    alignItems: "center",

  },
});

export default OrderConfirmation;
