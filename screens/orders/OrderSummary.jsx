// @ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";

import authContext from "../../context/auth/authContext";
import Screen from "../../components/Screen";

import Order from "../../models/Order";

import ListItem from "../../components/ListItem";

import cartContext from "../../context/cart/cartContext";

import ordersContext from "../../context/order/orderContext";
import AppButton from "../../components/AppButton";
import CardSummaryItem from "../../components/CardSummaryItem";
import { colors } from "react-native-elements";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { TextInput } from "react-native-gesture-handler";

const OrderSummary = ({ navigation, route }) => {
  const { user } = useContext(authContext);
  const { placeOrder } = useContext(ordersContext);
  const { cartItems, cartTotal, itemCounts, clearCart, loading } = useContext(
    cartContext
  );
  const [instruction, setInstrction] = useState(null)
  //const { deliveryMethod } = useContext(settingsContext);
  const { deliveryMethod, customer, paymentMethod } = route.params;

  console.log(instruction)

  if (!user) {
    navigation.navigate("Profile", {
      previewRoute: "Payment",
    });
  }

  const handlePayment = async () => {
    try {
      const newOrder = new Order(
        user.id,
        cartItems,
        customer,
        deliveryMethod,
        cartTotal,
        paymentMethod,
        instruction
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
          const order = await placeOrder(newOrder);

          clearCart();
          navigation.navigate("Orders", {
            screen: "OrderConfirmation",

            params: { order, paymentMethod },
          });
        }
      } else {
        Alert.alert("Empty Cart", "Cart is empty", [
          { text: "OK", style: "cancel" },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.listView}>
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
      <ScrollView style={styles.details}>
        {deliveryMethod === "pickup" ? (
          <>
            <Text
              style={{
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "800",
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
            </>
          )}
        <View style={styles.deliveryInstruction}>
          <Text style={{ fontFamily: 'montserrat', fontSize: 16, paddingVertical: 5, }}>Delivery Instructions</Text>
          <TextInput onChangeText={text => setInstrction(text)} value={instruction} style={styles.input} placeholder='Type any important message for the delivery guy' />
        </View>
        {paymentMethod === "cash" && deliveryMethod === "pickup" && (
          <Text>Handle cash pickup</Text>
        )}
        {paymentMethod === "credit" && deliveryMethod === "pickup" && (
          <View style={{ padding: 12 }}>
            <Text style={styles.text}>
              You will pay with debit or credit card, please have it ready.
            </Text>
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
      <View style={{ position: "absolute", bottom: 5, width: "100%" }}>
        <AppButton
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
});

export default OrderSummary;
