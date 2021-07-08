import React, { useLayoutEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

import moment from "moment";

import Screen from "../../components/Screen";
import { Ionicons } from '@expo/vector-icons';
import ListItem from "../../components/ListItem";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SIZES } from "../../config";


const OrderDetails = ({ route }) => {
  const { order } = route.params;

  const navigation = useNavigation()

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
          <Text style={{ ...FONTS.h4 }}>Order Date: </Text>{moment(order.orderPlaced).format("LL")}{" "}
        </Text>

        <Text style={styles.text}><Text style={{ ...FONTS.h4 }}>Order Type:</Text> {order.orderType}</Text>
        <Text style={styles.text}><Text style={{ ...FONTS.h4 }}>Payment Method:</Text> {order.paymentMethod}</Text>
        <Text style={styles.text}><Text style={{ ...FONTS.h4 }}>Payment Status:</Text> {order.isPaid ? 'Paid' : 'Pending'}</Text>
        <Text style={styles.text}><Text style={{ ...FONTS.h4 }}>Restaurant:</Text> {order.restaurant.name}</Text>
        <Text style={styles.text}>
          {order.orderType === "pickup" || order.type === "pickup" ? (

            `Person Picking Up: ${order.customer.name}`
          ) : (
              <Text numberOfLines={1} style={styles.text}>
                <Text style={{ ...FONTS.h4 }}>Delivered To: </Text> {order.customer.address.street},{" "}
                {order.customer.address.city}
              </Text>
            )}
        </Text>
        {order.coupon && (<Text style={{ ...FONTS.body4 }}><Text style={{ ...FONTS.h4 }}>Coupon Used: </Text> {(order.coupon.code).toUpperCase()} - {order.coupon.value}%</Text>)}
        {order.cancelReason && (<Text style={[styles.text, { color: 'red', fontWeight: '700' }]}>Canceled: {order.cancelReason}</Text>)}
        {order.instruction && (<Text style={{ ...FONTS.body4 }}>Note: {order.instruction}</Text>)}

      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: 'space-between',
          marginVertical: 10,
          paddingHorizontal: SIZES.padding,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...FONTS.h4
          }}
        >
          Order #: {order?.orderNumber}
        </Text>
        <Text
          style={{
            ...FONTS.h4
          }}
        >
          Items: {order.items.length}
        </Text>


      </View>

      <View style={{ width: "100%", marginTop: 5, }}>
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
        {/* TOTAL */}
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: SIZES.padding * 0.5 }}>

          {order.coupon && order.serviceFee && (
            <>
              <Text style={styles.sub}>Subtotal: ${order.coupon.originalPrice}</Text>
              <Text style={styles.sub}>Discount: <Text style={styles.sub, { color: COLORS.danger }}>-${(order.coupon.originalPrice - order.totalAmount).toFixed(2)}</Text> </Text>
              <Text style={styles.sub}>Service Fee: {order.serviceFee}</Text>
              <Text style={styles.sub, { fontSize: 14, fontWeight: '700' }}>Grand Total: {+(order.totalAmount + order.serviceFee).toFixed(2)}</Text>
            </>
          )}

          {order.serviceFee && !order.coupon && (<>
            <Text style={styles.sub}>Subtotal: ${order.totalAmount}</Text>
            <Text style={styles.sub}>Service Fee: {order.serviceFee}</Text>
            <Text style={styles.sub, { fontSize: 14, fontWeight: '700' }}>Grand Total: {+(order.totalAmount + order.serviceFee).toFixed(2)}</Text>
          </>)}
          {!order.serviceFee && order.coupon && (<>
            <Text style={styles.sub}>Subtotal: ${order.coupon.originalPrice}</Text>
            <Text style={styles.sub}>Discount: <Text style={styles.sub, { color: COLORS.danger }}>-${(order.coupon.originalPrice - order.totalAmount).toFixed(2)}</Text> </Text>
            <Text style={styles.sub, { fontSize: 14, fontWeight: '700' }}>Grand Total: {+(order.totalAmount).toFixed(2)}</Text>
          </>)}
          {!order.serviceFee && !order.coupon && (<>
            <Text style={styles.sub}>Subtotal: ${order.totalAmount}</Text>
            <Text style={styles.sub}>Discount: $0 </Text>
            <Text style={styles.sub, { fontSize: 14, fontWeight: '700' }}>Grand Total: {+(order.totalAmount).toFixed(2)}</Text>
          </>)}



        </View>
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
    backgroundColor: COLORS.tile,
    shadowOpacity: 0.7,
    shadowOffset: { width: 5, height: 3 },
    shadowColor: COLORS.primary,
    width: "98%",
    justifyContent: "center",
    fontFamily: "montserrat",
  },
  text: {

    paddingBottom: 5,
    textTransform: "capitalize",
    ...FONTS.body4
  },
  sub: {
    ...FONTS.body5
  }
});

export default OrderDetails;
