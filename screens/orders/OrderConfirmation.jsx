// @ts-nocheck
import React, { useState } from "react";
import { StyleSheet, Modal } from "react-native";

import { CommonActions } from "@react-navigation/native";

import Screen from "../../components/Screen";

import LottieView from "lottie-react-native";
import { COLORS } from "../../config";

const OrderConfirmation = ({ navigation, route }) => {
  const { order } = route.params;

  const [isVisible, setIsVisible] = useState(true);

  const resetCartNavigation = () => {
    navigation.dispatch(state => {
      // Remove the home route from the stack


      return CommonActions.reset({
        index: 0,
        routes: [{ name: 'CartTab' }]
      });
    });
    navigation.navigate("Orders", {
      screen: "OrderDetails",
      params: { order },
    });
  };

  return (
    <Screen style={styles.screen}>
      <Modal
        visible={isVisible}
        animationType="slide"
        onDismiss={resetCartNavigation}
      >
        <LottieView
          loop={false}
          autoPlay
          colorFilters={[
            { keypath: "Sending Loader", color: COLORS.secondary },
          ]}
          onAnimationFinish={() => setIsVisible(false)}
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
