import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import colors from "../config/colors";
import constants from "../config/constants";

import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("screen");

const CartItemTile = ({
  item,
  onLongPress,
  onAddMore,
  onRemove,
  isDisable,
}) => {
  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      <View style={styles.container}>
        <View style={styles.imgView}>
          <Image style={styles.img} source={{ uri: item.imageUrl }} />
        </View>
        <View style={styles.details}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.qty}>
              {item.quantity} x ${item.price}
            </Text>
          </View>
          <View style={styles.totalView}>
            <View style={styles.mini}>
              <TouchableOpacity disabled={isDisable} onPress={onRemove}>
                <Feather name="minus" size={28} color="black" />
              </TouchableOpacity>
              <View style={styles.divider}></View>

              <TouchableOpacity disabled={isDisable} onPress={onAddMore}>
                <Feather name="plus" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.priceView}>
              <Text style={styles.price}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.95,
    height: 120,
    backgroundColor: colors.primary,
    borderRadius: 5,
    elevation: 10,
    margin: 10,
    shadowOffset: {
      height: 5,
      width: 5,
    },
    shadowOpacity: 0.4,
    shadowColor: "black",
    shadowRadius: 5,

    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  imgView: {
    width: "40%",
  },

  details: {
    alignItems: "flex-start",
    width: "60%",
    height: "100%",
    backgroundColor: colors.primary,
    padding: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 8,
    color: colors.secondary,
  },
  totalView: {
    width: "100%",
    padding: 2,
    marginTop: 5,
    height: 50,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
  },
  mini: {
    height: "100%",
    width: "50%",
    backgroundColor: colors.card,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  priceView: {
    width: "40%",
    marginHorizontal: 5,
  },

  divider: {
    height: "100%",
    width: 2,
    backgroundColor: "grey",
  },
  qty: {
    color: colors.secondary,
  },
});

export default CartItemTile;
