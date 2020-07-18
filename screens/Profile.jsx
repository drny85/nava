import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Screen from "../components/Screen";
import ordersContext from "../context/order/orderContext";

import constants from "../config/constants";

const Profile = () => {
  const { orders, getOrders } = useContext(ordersContext);

  useEffect(() => {
    //getOrders();
  }, []);

  console.log(orders);
  return (
    <Screen style={styles.container}>
      <View style={styles.imageView}>
        <Image
          style={styles.img}
          source={require("../assets/images/profile.jpg")}
          resizeMode="contain"
        />
      </View>
      <View></View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
  },
  imageView: {
    width: "100%",
    height: constants.heigth * 0.3,
  },
  img: {
    width: "100%",
    height: "100%",
  },
});

export default Profile;
