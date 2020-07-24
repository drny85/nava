import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AppButton from "../components/AppButton";
import { db } from "../services/database";
import cartContext from "../context/cart/cartContext";
import colors from "../config/colors";
import { color } from "react-native-reanimated";
import authContext from "../context/auth/authContext";
import settingsContext from "../context/settings/settingsContext";
import Pick from "../components/Pick";

const Checkout = ({ route, navigation }) => {
  const {
    cart: { cartItems, cartTotal, itemCounts },
  } = route.params;
  const { user } = useContext(authContext);
  const [paymentOption, setPaymentOption] = useState("credit");
  const { setRoute, setDeliveryMethod, deliveryMethod } = useContext(
    settingsContext
  );

  const [deliveryOption, setDeliveryOption] = useState(deliveryMethod);

  const { clearCart } = useContext(cartContext);

  const continueToPayment = () => {
    if (!user) {
      setRoute("Payment");
      setDeliveryMethod(deliveryOption);
      navigation.navigate("Profile");
      return;
    }
    navigation.navigate("Payment", { deliveryMethod: deliveryOption });
  };

  console.log(paymentOption);

  return (
    <View style={styles.container}>
      <Text style={styles.summary}>Order Summary</Text>
      <View style={styles.view}>
        <Text style={styles.qty}>Items Quantity: {itemCounts}</Text>
        <Text style={styles.total}>Order Tortal: ${cartTotal}</Text>
      </View>
      <View style={styles.delivery}>
        <TouchableOpacity
          onPress={() => setDeliveryOption("delivery")}
          style={{
            height: "100%",
            backgroundColor:
              deliveryOption === "delivery" ? colors.primary : colors.tile,
            width: "50%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <View>
            <Text style={styles.option}>Delivery</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider}></View>
        <TouchableOpacity
          onPress={() => setDeliveryOption("pickup")}
          style={{
            height: "100%",
            backgroundColor:
              deliveryOption === "pickup" ? colors.primary : colors.tile,
            width: "50%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <View>
            <Text style={styles.option}>Pick up</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.delivery}>
        <Pick
          title="credit"
          type={paymentOption}
          onPress={() => setPaymentOption("credit")}
          width="33%"
        />
        <View style={styles.divider}></View>
        <Pick
          title="cash"
          type={paymentOption}
          onPress={() => setPaymentOption("cash")}
          width="33%"
        />
        <View style={styles.divider}></View>
        <Pick
          title="in store"
          type={paymentOption}
          onPress={() => setPaymentOption("in store")}
          width="33%"
        />
      </View>
      <AppButton
        style={styles.btn}
        title="Check Out"
        onPress={continueToPayment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    marginTop: 10,
  },
  btn: {
    width: "95%",
    marginTop: 20,
  },

  delivery: {
    overflow: "hidden",
    width: "95%",
    height: Dimensions.get("screen").height * 0.07,
    borderRadius: 50,
    backgroundColor: colors.tile,
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowColor: "grey",

    elevation: 10,
    borderColor: "grey",
    borderWidth: 0.5,
  },
  divider: {
    height: "100%",
    width: 2,
    backgroundColor: "grey",
  },
  summary: {
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 20,
  },
  view: {
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    height: Dimensions.get("screen").height * 0.3,
    elevation: 10,
    borderRadius: 5,
    shadowColor: "grey",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    padding: 10,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    borderColor: "grey",
    backgroundColor: colors.tile,
  },
  qty: {
    fontSize: 22,
    padding: 5,
  },
  total: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 10,
  },
  option: {
    fontSize: 24,
    fontWeight: "700",
  },
});

export default Checkout;
