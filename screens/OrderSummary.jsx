import React, { useContext } from "react";
import { View, StyleSheet, Text, FlatList, Dimensions } from "react-native";
import * as Yup from "yup";

import authContext from "../context/auth/authContext";
import settingsContext from "../context/settings/settingsContext";
import Screen from "../components/Screen";
import AppForm from "../components/AppForm";
import AppFormField from "../components/AppFormField";
import Order from "../models/Order";

import AppSubmitButton from "../components/AppSubmitButton";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import cartContext from "../context/cart/cartContext";
import OrdersState from "../context/order/orderState";
import ordersContext from "../context/order/orderContext";
import AppButton from "../components/AppButton";
import { CLEAR_CART } from "../context/types";

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required().label("Name"),
//   lastName: Yup.string().required().label("Last Name"),
//   address: Yup.string().required().label("Address"),
//   apt: Yup.string(),
//   city: Yup.string().required().label("City"),
//   zipcode: Yup.string().required().min(5).label("Zip code"),
// });

const Payment = ({ navigation, route }) => {
  const { user } = useContext(authContext);
  const { placeOrder } = useContext(ordersContext);
  const { cartItems, cartTotal, itemCounts, clearCart } = useContext(
    cartContext
  );
  //const { deliveryMethod } = useContext(settingsContext);
  const { deliveryMethod, customer, paymentMethod } = route.params;

  console.log("SUMMARY", deliveryMethod, customer, paymentMethod);

  if (!user) {
    navigation.navigate("Profile", {
      previewRoute: "Payment",
    });
  }

  const handlePayment = async () => {
    try {
      const order = new Order(
        cartItems,
        customer,
        deliveryMethod,
        cartTotal,
        paymentMethod
      );
      const newOrder = await placeOrder(order);
      console.log(newOrder);
      if (newOrder) {
        console.log(newOrder);
        clearCart();
        navigation.replace("OrderConfirmation");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={{ height: Dimensions.get("screen").height * 0.4 }}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              name={item.name}
              imageUrl={item.imageUrl}
              qty={item.quantity}
              price={item.price}
            />
          )}
        />
      </View>
      <AppButton title="Place Order" onPress={handlePayment} />

      {/* <ScrollView>
        <AppForm
          initialValues={{ name: "" }}
          onSubmit={handlePayment}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoFocus={true}
            placeholder="Name"
            name="name"
            autoCorrect={false}
          />
          <AppFormField
            placeholder="Last Name"
            name="lastName"
            autoCorrect={false}
          />

          <AppFormField
            placeholder="Address"
            name="address"
            textContentType="streetAddressLine1"
            autoCorrect={false}
          />
          <AppFormField
            placeholder="Apt, Suite"
            name="apt"
            textContentType="streetAddressLine2"
            autoCorrect={false}
          />
          <AppFormField placeholder="City" name="city" autoCorrect={false} />
          <AppFormField
            placeholder="Zip Code"
            name="zipcode"
            autoCorrect={false}
            keyboardType="number-pad"
            textContentType="postalCode"
          />
          <AppSubmitButton disable={} title="Pay" />
        </AppForm>
      </ScrollView> */}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,

    marginHorizontal: 10,
  },
});

export default Payment;
