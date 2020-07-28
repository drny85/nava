import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
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
import Loader from "../components/Loader";

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
  const [isVisible, setIsVisible] = useState(false);
  const { placeOrder } = useContext(ordersContext);
  const { cartItems, cartTotal, itemCounts, clearCart, loading } = useContext(
    cartContext
  );
  //const { deliveryMethod } = useContext(settingsContext);
  const { deliveryMethod, customer, paymentMethod } = route.params;

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
      if (cartItems.length > 0) {
        await placeOrder(order);

        clearCart();
        setIsVisible(true);
        //navigation.replace("OrderConfirmation");
      } else {
        Alert.alert("Empty Cart", "Cart is empty", [
          { text: "OK", style: "cancel" },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("METHOD", deliveryMethod);

  return (
    <Screen style={styles.container}>
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onDismiss={() => navigation.navigate("Home")}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "grey",
          }}
        >
          <Text>Your order has been placed</Text>
          <AppButton title="Close" onPress={() => setIsVisible(false)} />
        </View>
      </Modal>

      <View style={styles.listView}>
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
      <ScrollView style={styles.details}>
        {deliveryMethod === "pickup" ? (
          <Text>You will be picking up this order</Text>
        ) : (
          <>
            <Text>You will be delivered to this address</Text>
            <Text>Place holder for address</Text>
          </>
        )}
      </ScrollView>
      <View style={{ position: "absolute", bottom: 5, width: "100%" }}>
        <AppButton title="Place Order" onPress={handlePayment} />
      </View>

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
    marginTop: 20,
    backgroundColor: "red",

    marginHorizontal: 10,
  },
  listView: {
    backgroundColor: "blue",
    maxHeight: Dimensions.get("screen").height * 0.3,
  },
  details: {
    flex: 2,
    backgroundColor: "grey",
  },
});

export default Payment;
