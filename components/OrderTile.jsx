import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import colors from "../config/colors";
import { COLORS, FONTS, SIZES } from "../config";
import cartContext from "../context/cart/cartContext";
import { useNavigation } from "@react-navigation/native";

import Spinner from "./Spinner";
import ordersContext from "../context/order/orderContext";

const OrderTile = ({ order, onPress }) => {
  const { addToCart, cartItems, clearCart } = useContext(cartContext);

  const { loadingOrders, stopOrdersLoading } = useContext(ordersContext);
  const navigation = useNavigation();
  const addThem = async () => {
    try {
      await loadingOrders();
      for (let index = 0; index < order.items.length; index++) {
        const element = order.items[index];

        if (order.coupon) {
          element.price = element.originalPrice

        }
        if (element.originalPrice) {
          delete element.originalPrice
        }

        await addToCart(element);
        //calculateCartTotal(order.items)
      }
      stopOrdersLoading();
      // navigation.navigate('Cart')
    } catch (error) {
      console.log("Error adding items to cart", error);
    }
  };
  // add all items to cart from selected previous order and go right to check out
  const addToCartAndCheckout = async () => {
    try {
      if (cartItems.length > 0) {
        Alert.alert(
          "Cart not empty",
          "All items in cart will be deleted and check out with these",
          [
            {
              text: "Yes Please",
              onPress: async () => {
                await loadingOrders();

                await clearCart();
                await addThem();
                await stopOrdersLoading();

                navigation.navigate("CartTab", {
                  screen: "OrderSummary",
                  initial: false,
                  params: {
                    deliveryMethod: order?.orderType,
                    paymentMethod: order?.paymentMethod,
                    customer: order?.customer,
                    screen: 'Cart'

                  },
                });
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                return;
              },
            },
          ]
        );
      } else {
        loadingOrders();
        await addThem();
        stopOrdersLoading();

        navigation.navigate("CartTab", {
          screen: 'OrderSummary',
          initial: false,
          params: {
            deliveryMethod: order?.orderType,
            paymentMethod: order?.paymentMethod,
            customer: order?.customer,
            screen: 'Cart'


          },
        });
      }
    } catch (error) {
      console.log("Error adding and checking out", error);
    }
  };

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
        disabled={order.status === "new"}
        onPress={addToCartAndCheckout}
        style={{
          backgroundColor:
            order.status === "new" ? COLORS.lightGray : COLORS.secondary,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 8,
          paddingHorizontal: 15,
        }}
      >
        <Text style={{ ...FONTS.body5, color: COLORS.primary }}>
          {order.status === "new" ? "Progress" : "Re-order"}
        </Text>
      </TouchableOpacity>
      <EvilIcons name="chevron-right" size={35} color={colors.ascent} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height * 0.1,
    width: "100%",
    backgroundColor: colors.tile,
    borderBottomWidth: 0.3,
    borderColor: colors.primary,
    shadowColor: colors.primary,
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
