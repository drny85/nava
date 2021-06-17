import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image

} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../config";
import cartContext from "../context/cart/cartContext";
import { useNavigation } from "@react-navigation/native";

import ordersContext from "../context/order/orderContext";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const OrderTile = ({ order, onPress }) => {
  const { addToCart, cartItems, clearCart } = useContext(cartContext);

  const { loadingOrders, stopOrdersLoading } = useContext(ordersContext);
  const navigation = useNavigation();


  return (
    <TouchableOpacity onPress={onPress} style={[styles.container]}>
      {/* restaurant image view */}
      <View style={{ height: "100%", width: SIZES.width * 0.2 }}>
        <Image
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 5,
          }}
          resizeMode="cover"
          source={{
            uri: order.restaurant.imageUrl
              ? order.restaurant.imageUrl
              : "https://img.texasmonthly.com/2020/04/restaurants-covid-19-coronavirus-not-reopening-salome-mcallen.jpg?auto=compress&crop=faces&fit=fit&fm=pjpg&ixlib=php-1.2.1&q=45&w=1100",
          }}
        />
      </View>
      {/* order details view */}
      <View
        style={{
          justifyContent: "flex-start",
          alignContent: "center",
          flexDirection: "column",
          flex: 1,
          padding: 10,

        }}
      >
        <Text style={{ ...FONTS.h5, textTransform: "capitalize" }}>
          {order.restaurant.name}
        </Text>
        <Text style={{ ...FONTS.body6 }}>Type: {order.orderType}</Text>
        {/* <Text style={{ ...FONTS.body4 }}>
          {moment(order.orderPlaced).format("lll")}
        </Text> */}
        <Text style={{ ...FONTS.body6, paddingVertical: 6 }}>
          Total: ${parseFloat(order.totalAmount).toFixed(2)}
        </Text>
      </View>
      {/* re-order button */}

      <TouchableOpacity
        disabled={order.status !== 'delivered' || order.status !== 'pickup'}

        style={{
          backgroundColor:
            order.status === "new" ? COLORS.lightGray : order.status === 'in progress' ? COLORS.ascent : order.status === 'canceled' ? COLORS.danger : COLORS.secondary,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          width: SIZES.width * 0.25,
          paddingVertical: 8,
          paddingHorizontal: 15,
          zIndex: 100,
        }}
      >
        <Text style={{ ...FONTS.body5, color: COLORS.primary, textTransform: 'capitalize' }}>
          {order.status === "new" ? "New" : order.status === 'in progress' ? 'Preparing' : `${order.status}`}
        </Text>
      </TouchableOpacity>

      <EvilIcons name="chevron-right" size={35} color={COLORS.ascent} />
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZES.height * 0.1,
    width: "100%",
    backgroundColor: COLORS.tile,
    borderBottomWidth: 0.3,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.7,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },

  text: { fontWeight: "600", marginRight: 8 },
});

export default OrderTile;
