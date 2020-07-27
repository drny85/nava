import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../components/Screen";

const OrderConfirmation = () => {
  return (
    <Screen style={styles.screen}>
      <Text>Order Confirmation</Text>
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
