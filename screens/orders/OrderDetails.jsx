import React, { useContext, useLayoutEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

import moment from "moment";

import Screen from "../../components/Screen";
import { Ionicons } from '@expo/vector-icons';
import colors from "../../config/colors";
import ListItem from "../../components/ListItem";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS } from "../../config";


const OrderDetails = ({ route }) => {
  const { order } = route.params;
  const navigation = useNavigation()

  if (order) {
    navigation.navigate("OrderInTheMaking", { order });
  }

  useLayoutEffect(() => {
    navigation.setOptions({

      headerLeft: () => {
        return <Ionicons
          style={{ marginLeft: 12 }}
          onPress={() => navigation.navigate('MyOrders')}
          name="md-arrow-back"
          color={COLORS.secondary}
          size={30}
        />
      }
    })
  }, [navigation])

  return (
    <Screen style={styles.container}>
      <View style={styles.orderInfo}>
        <Text style={styles.text}>
          Date: {moment(order.orderPlaced).format("LL")}{" "}
        </Text>
        <Text style={styles.text}>
          Customer: {order.customer.name} {order.customer.lastName}
        </Text>
        <Text style={styles.text}>Order Type: {order.orderType}</Text>
        <Text style={styles.text}>Payment Method: {order.paymentMethod}</Text>
        <Text style={styles.text}>Restaurant: {order.restaurant.name}</Text>
        <Text style={styles.text}>
          {order.orderType === "pickup" || order.type === "pickup" ? (
            `Person Picking Up: ${order.customer.name}`
          ) : (
              <Text numberOfLines={1} style={styles.text}>
                Delivered to: {order.customer.address.street},{" "}
                {order.customer.address.city}
              </Text>
            )}
        </Text>
        {order.coupon && (<Text style={{ ...FONTS.body4 }}>Coupon Used: {(order.coupon.code).toUpperCase()} - {order.coupon.value}%</Text>)}
        {order.cancelReason && (<Text style={[styles.text, { color: 'red', fontWeight: '700' }]}>Canceled: {order.cancelReason}</Text>)}
        {order.instruction && (<Text style={{ ...FONTS.body4 }}>Note: {order.instruction}</Text>)}

      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginVertical: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...FONTS.h4
          }}
        >
          Order #: {order.orderNumber}
        </Text>
        <Text
          style={{
            ...FONTS.h4
          }}
        >
          Items: {order.items.length}
        </Text>
        <View style={{ flexDirection: 'row', }}>
          <Text style={{ ...FONTS.h4 }}>Amount: </Text>
          {order.coupon && (<Text style={{ ...FONTS.h4, color: 'red', opacity: 0.4, textDecorationLine: 'line-through', marginRight: 8 }}>${order.coupon.originalPrice.toFixed(2)}</Text>)}
          <Text
            style={{
              ...FONTS.h4
            }}
          >
            ${parseFloat(order.totalAmount).toFixed(2)}
          </Text>

        </View>

      </View>

      <View style={{ width: "100%", marginTop: 5, flex: 1 }}>
        <FlatList
          data={order.items}
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              imageUrl={item.imageUrl}
              qty={item.quantity}
              price={item.price}
              size={item.size}
            />
          )}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    //fontFamily: "montserrat",

  },

  orderInfo: {
    marginTop: 3,
    padding: 10,

    paddingVertical: 10,
    elevation: 10,
    backgroundColor: colors.tile,
    shadowOpacity: 0.7,
    shadowOffset: { width: 5, height: 3 },
    shadowColor: colors.primary,
    width: "98%",
    justifyContent: "center",
    fontFamily: "montserrat",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    paddingBottom: 8,
    textTransform: "capitalize",
    fontFamily: "montserrat",
  },
});

export default OrderDetails;
