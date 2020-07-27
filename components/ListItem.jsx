import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../config/colors";

const ListItem = ({ name, imageUrl, price, qty }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", height: "100%" }}>
        <Image style={styles.img} source={{ uri: imageUrl }} />
        <View style={styles.firstView}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.qty}>
            {qty} x {price}
          </Text>
        </View>
      </View>

      <Text style={styles.price}>${(price * qty).toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
    backgroundColor: colors.tile,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 2,
    elevation: 10,
    shadowOffset: { width: 4, height: 3 },
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
  },
  firstView: {
    paddingLeft: 10,

    justifyContent: "center",
  },
  img: {
    width: 80,
    height: "100%",
    resizeMode: "cover",
    borderRadius: 2,
  },
  name: {
    fontSize: 18,
    textTransform: "capitalize",
    paddingBottom: 10,
  },
  price: {
    fontWeight: "700",
  },
  qty: {},
});

export default ListItem;
