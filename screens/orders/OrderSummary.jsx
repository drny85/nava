// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";


import authContext from "../../context/auth/authContext";
import Screen from "../../components/Screen";

import Order from "../../models/Order";

import ListItem from "../../components/ListItem";

import { CommonActions } from "@react-navigation/native";

import cartContext from "../../context/cart/cartContext";

import ordersContext from "../../context/order/orderContext";
import AppButton from "../../components/AppButton";
import CardSummaryItem from "../../components/CardSummaryItem";

import { TextInput } from "react-native-gesture-handler";
import storesContext from "../../context/stores/storesContext";
import Divider from "../../components/Divider";
import { FONTS } from "../../config";
import Loader from "../../components/Loader";

const OrderSummary = ({ navigation, route }) => {
  const { user } = useContext(authContext);
  const { placeOrder } = useContext(ordersContext);
  const { cartItems, cartTotal, clearCart, loading } = useContext(
    cartContext
  );
  const status = 'new';
  const { stores } = useContext(storesContext)
  const restaurants = [...stores];
  const restaurant = restaurants.find(s => s.id === cartItems[0]?.storeId)
  const [instruction, setInstrction] = useState(null)

  const { deliveryMethod, customer, paymentMethod } = route.params;



  if (!user) {
    navigation.navigate("Profile", {
      previewRoute: "Payment",
    });
  }

  const handlePayment = async () => {
    if (cartItems.length === 0) {

      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "Cart" }, { name: 'Cart' }],
        })
      );
      return;
    }

    if (!restaurant.open) {
      Alert.alert('CLOSED', 'Store already closed', [{ text: 'OK', style: 'cancel' }])
      return
    }


    try {
      const newOrder = new Order(
        user.id,
        cartItems,
        customer,
        deliveryMethod,
        cartTotal,
        paymentMethod,
        status,
        instruction,
        restaurant

      );


      if (cartItems.length > 0) {
        //handle payment with credit
        if (paymentMethod === "credit") {
          navigation.navigate("Orders", {
            screen: "OrderVerification",

            params: { newOrder, paymentMethod },
          });
        } else {
          //handle payment with cash

          const { data, error } = await placeOrder(newOrder);
          if (error) {
            console.log('Error at Order Summary line 81', error)
            return;
          }
          if (data) {
            clearCart();
            navigation.navigate("Orders", {
              screen: "OrderConfirmation",

              params: { order: data, paymentMethod },
            });
          }


        }
      } else {
        Alert.alert("Empty Cart", "Cart is empty", [
          { text: "OK", style: "cancel" },
        ]);
      }
    } catch (error) {

      console.log('Error catched', error);
    }
  };



  if (loading) return <Loader />

  return (
    <Screen >

      <View style={styles.listView}>
        <View style={styles.storeInfo}>
          {restaurant && (
            <>
              <Text style={styles.textTitle}>Store Details</Text>
              <Text style={styles.text}>{restaurant.name}</Text>
              <Text style={styles.text}>{restaurant.street}, {restaurant.city} {restaurant.zipcode}</Text>
            </>
          )}
        </View>
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={({ item }) => (
            <ListItem
              sizes={item.sizes}
              name={item.name}
              imageUrl={item.imageUrl}
              qty={item.quantity}
              size={item.size}
              price={item.price}

            />
          )}
        />
      </View>
      <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={100} behavior='padding'>
        <ScrollView style={styles.details}>
          {deliveryMethod === "pickup" ? (
            <>
              <Text
                style={{
                  ...FONTS.italic,
                  marginBottom: 20,
                }}
              >
                Important information about your order {customer.name}
              </Text>
              <Text style={styles.title}>
                You will be picking up this order at the restaurant
            </Text>
            </>
          ) : (
              <>
                <View>
                  <CardSummaryItem
                    onPress={() => navigation.goBack()}
                    title="Your order will be delivered to:"
                    subtitle={`${customer.address.street} ${customer.address.apt ? customer.address.apt : null
                      }`}
                    misc={`${customer.address.city}, ${customer.address.zipcode}`}
                  />
                  <CardSummaryItem
                    onPress={() => navigation.goBack()}
                    title="You might be contacted at:"
                    subtitle={`Phone: ${customer.phone}`}
                    misc={`Email: ${customer.email}`}
                  />
                </View>
                <Divider />
                <View style={styles.deliveryInstruction}>
                  <Text style={{ fontFamily: 'montserrat', fontSize: 16, paddingVertical: 5, }}>Delivery Instructions</Text>
                  <TextInput onChangeText={text => setInstrction(text)} numberOfLines={2} value={instruction} style={styles.input} placeholder='Ex. Ring the bell' />
                </View>
              </>
            )}

          {paymentMethod === "cash" && deliveryMethod === "pickup" && (
            <Text>Handle cash pickup</Text>
          )}
          {paymentMethod === "credit" && deliveryMethod === "pickup" && (
            <View style={{ padding: 12 }}>
              <Text style={styles.text}>
                You will pay with debit or credit card, please have it ready.
            </Text>
              <Divider />
              <Text style={styles.text}>
                Just click Pay Now at the bottom to enter your card information.
            </Text>
            </View>
          )}
          {paymentMethod === "in store" && deliveryMethod === "pickup" && (
            <View style={styles.pickup}>
              <Text style={styles.title}>
                You will pay for this order at the store
            </Text>
              <Text style={styles.title}>
                You can pay with cash or credit / debit card
            </Text>
              <View style={styles.totalView}>
                <Text style={styles.title}>Order Total</Text>
                <Text style={{ fontWeight: "bold", fontSize: 45 }}>
                  ${cartTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
          {paymentMethod === "cash" && deliveryMethod === "delivery" && (
            <View style={styles.infoView}>
              <Text style={styles.infotext}>
                Your order total is ${cartTotal.toFixed(2)}, please have this
              amount available in cash. Always be generous and tip the delivery
              guy.
            </Text>
            </View>
          )}


        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ position: "absolute", bottom: 8, width: "100%", }}>
        <AppButton
          style={{ width: '90%', alignSelf: 'center' }}
          title={paymentMethod === "credit" ? "Pay Now" : "Place Order"}
          onPress={handlePayment}
        />
      </View>

    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 10,
    flex: 1,
  },
  listView: {
    maxHeight: Dimensions.get("screen").height * 0.35,
  },
  details: {
    flex: 2,
    padding: 10,
  },
  deliveryInstruction: {
    width: '100%',
    marginVertical: 12,

  },



  title: {
    fontWeight: "600",
    fontSize: 16,
    marginVertical: 10,
  },
  address: {
    fontSize: 16,
  },
  input: {

    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 0.4,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },

  infoView: {
    width: "100%",
    marginTop: 20,
    shadowOffset: {
      width: 5,
      height: 7,
    },
    shadowOpacity: 0.7,
    shadowColor: "grey",
    paddingTop: 5,
    elevation: 10,
    shadowRadius: 2,
  },
  infotext: {
    fontSize: 20,
    fontWeight: "600",
  },

  totalView: {
    padding: 20,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontFamily: "montserrat",
    fontSize: 16,
    marginBottom: 12,
  },
  storeInfo: {
    width: '100%',
    padding: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    fontFamily: 'montserrat',
    fontSize: 14,
    paddingVertical: 2,
    textTransform: 'capitalize'
  },
  textTitle: {
    fontFamily: 'montserrat-bold',
    fontSize: 14,

    paddingVertical: 2,
    textTransform: 'capitalize'
  },
});

export default OrderSummary;
