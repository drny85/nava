// @ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

import cartContext from "../../context/cart/cartContext";
import colors from "../../config/colors";
import settingsContext from "../../context/settings/settingsContext";
import Pick from "../../components/Pick";

import AppForm from "../../components/AppForm";
import AppFormField from "../../components/AppFormField";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as Yup from "yup";
import AppSubmitButton from "../../components/AppSubmitButton";
import authContext from "../../context/auth/authContext";
import AppButton from "../../components/AppButton";
import { FONTS } from "../../config";


const zipCodes = ['10452', '10451', '10453', '10456', '10457']

const MINIMUM_DELIVERY = 10;

const Checkout = ({ route, navigation }) => {


  const [paymentOption, setPaymentOption] = useState("credit");
  const [canContinue, setCanContinue] = useState(false);
  const [error, setError] = useState(null);
  const { deliveryMethod } = useContext(settingsContext);
  const { user } = useContext(authContext);
  const previous = route.params?.previous;
  const { restaurant } = route.params;
  console.log(restaurant)

  const [deliveryOption, setDeliveryOption] = useState(deliveryMethod);
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  const { cartTotal, itemCounts } = useContext(cartContext);

  const handlePickup = (pickupInfo) => {
    if (paymentOption === "cash") {
      Alert.alert("Payment", "Please select a payment method", [
        { text: "OK", style: "cancel" },
      ]);
      return;
    }

    navigation.navigate("Orders", {
      screen: "OrderSummary",
      params: {
        deliveryMethod: deliveryOption,
        paymentMethod: paymentOption,
        customer: { name: user?.name, lastName: user?.lastName, email: user?.email, phone: user?.phone }
      },
    });
  };

  const handleDelivery = (deliveryInfo) => {

    if (paymentOption === "in store" || paymentOption === "") {
      Alert.alert("Payment", "Please select a payment method", [
        { text: "OK", style: "cancel" },
      ]);
      return;
    }

    //check if delivery address was selected
    if (!deliveryAddress) {
      Alert.alert(
        "Select an address",
        "Please enter a delivery address so we know where to send your order",
        [
          {
            text: "Add Address",
            onPress: () =>
              navigation.navigate("MyAddress", { previous: "Checkout" }),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    //  check cart total is greater than 10 for minimum delivery amount.
    if (deliveryMethod === "delivery" && cartTotal < MINIMUM_DELIVERY) {
      console.log("minimun delivery");
      Alert.alert(
        "Minimum Delivery",
        `Please spend at least $${MINIMUM_DELIVERY - cartTotal
        } more to be eligible for delivery`,
        [{ text: "OK", style: "cancel" }]
      );
      return;
    }

    navigation.navigate("Orders", {
      screen: "OrderSummary",
      params: {
        deliveryMethod: deliveryOption,
        paymentMethod: paymentOption,
        customer: { name: user?.name, lastName: user?.lastName, email: user?.email, phone: user?.phone, address: { ...previous } },
      },
    });
  };

  const checkDeliveryAddress = () => {
    if (previous) {
      setDeliveryAddress(previous);
      const zip = previous.zipcode
      if (restaurant?.deliveryZip.includes(zip)) {
        setCanContinue(true)
        setError(null)


      } else {
        setCanContinue(false)
        setError('No delivery at this address')

        Alert.alert(
          "Not Delivery Available",
          "Please select a new delivery address",
          [
            {
              text: "Add Address",
              onPress: () =>
                navigation.navigate("MyAddress", { previous: "Checkout" }),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }

    }
  }

  useEffect(() => {
    console.log("Checkout Mounted");
    checkDeliveryAddress()
  }, [previous]);

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get('screen').height,
        flex: 1,


      }}
    >
      <View style={{ flex: 1, width: Dimensions.get('screen').width, alignItems: 'center' }}>
        <View style={styles.view}>

          <Text style={styles.qty}>Total Items: {itemCounts}</Text>
          <Text style={styles.total}>Order Total: ${cartTotal.toFixed(2)}</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>Delivery Option</Text>
          <View style={styles.delivery}>
            <TouchableOpacity
              onPress={() => {
                setDeliveryOption("delivery")
                if (!deliveryAddress) {
                  setCanContinue(false)
                } else {
                  setCanContinue(true)
                }

              }}
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
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color:
                      deliveryOption === "delivery"
                        ? colors.secondary
                        : "black",
                  }}
                >
                  Delivery
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider}></View>
            <TouchableOpacity
              onPress={() => {
                setDeliveryOption("pickup")
                setCanContinue(true)
              }}
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
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "700",
                    color:
                      deliveryOption === "pickup" ? colors.secondary : "black",
                  }}
                >
                  Pick up
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Payment Option</Text>
          <View style={styles.delivery}>
            {deliveryOption === "delivery" ? (
              <>
                <Pick
                  title="credit"
                  type={paymentOption}
                  style={{
                    color:
                      paymentOption === "credit" ? colors.secondary : "black",
                  }}
                  onPress={() => setPaymentOption("credit")}
                />
                <View style={styles.divider}></View>
                <Pick
                  title="cash"
                  style={{
                    color:
                      paymentOption === "cash" ? colors.secondary : "black",
                  }}
                  type={paymentOption}
                  onPress={() => setPaymentOption("cash")}
                />
              </>
            ) : (
                <>
                  <Pick
                    title="credit"
                    style={{
                      color:
                        paymentOption === "credit" ? colors.secondary : "black",
                    }}
                    type={paymentOption}
                    onPress={() => setPaymentOption("credit")}
                  />
                  <View style={styles.divider}></View>
                  <Pick
                    title="in store"
                    style={{
                      color:
                        paymentOption === "in store" ? colors.secondary : "black",
                    }}
                    type={paymentOption}
                    onPress={() => setPaymentOption("in store")}
                  />
                </>
              )}
          </View>
          {deliveryOption === "delivery" && (
            <View style={styles.addressView}>
              <Text style={{ ...FONTS.h4 }}>Delivery Information</Text>
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("MyAddress", { previous: "Checkout" })
                }
              >
                <View style={styles.pickAddress}>
                  <View>
                    <Text style={styles.deliveryTitle}>
                      {previous ? `Delivery Address` : `Pick an address *`}
                    </Text>
                    <View style={{ padding: 10 }}>
                      {deliveryAddress ? (
                        <>
                          <Text style={styles.deliveryText}>
                            {deliveryAddress.street}{" "}
                            {deliveryAddress.apt
                              ? `, Apt ${deliveryAddress.apt}`
                              : null}
                          </Text>
                          <Text style={styles.deliveryText}>
                            {deliveryAddress.city}, {deliveryAddress.zipcode}
                          </Text>
                        </>
                      ) : null}
                    </View>

                  </View>

                  <View>
                    <MaterialCommunityIcons
                      style={styles.icon}
                      name="chevron-right"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {error && <Text style={{ ...FONTS.body4, color: 'red' }}>{error}</Text>}

              <View style={{ height: 80 }}></View>
            </View>
          )}
        </View>




      </View>
      <View style={{ marginBottom: 20, width: "90%", }}>
        {/* <AppSubmitButton disabled={!canContinue} title="Check Out" /> */}
        <AppButton title='Check Out' disabled={!canContinue} onPress={deliveryOption === 'delivery' ? handleDelivery : handlePickup} />
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,


  },
  addressView: {
    width: "100%",
    height: Dimensions.get('screen').height * 0.25,
    alignItems: "center",
    marginVertical: 10,
  },
  btn: {
    width: "95%",
    marginTop: 20,
    position: "absolute",
    bottom: 5,
    backgroundColor: colors.secondary,
  },

  delivery: {
    overflow: "hidden",
    width: "95%",
    height: Dimensions.get("screen").height * 0.06,
    borderRadius: 50,
    backgroundColor: colors.tile,
    marginVertical: 10,
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
  deliveryTitle: {
    fontFamily: "montserrat-bold",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  divider: {
    height: "100%",
    width: 2,
    backgroundColor: "grey",
  },

  form: {
    width: "100%",
    alignItems: "center",
  },
  summary: {
    fontSize: 18,
    fontWeight: "700",
    paddingBottom: 20,
  },
  view: {
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    height: Dimensions.get("screen").height * 0.15,
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
    fontSize: 22,
    fontWeight: "bold",
    padding: 10,
  },
  pickAddress: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.13,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: colors.secondary,
    borderBottomColor: colors.secondary,
    justifyContent: "space-between",
    flexDirection: "row",

    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },

  icon: {
    marginRight: 10,
  },
  deliveryText: {
    fontFamily: "montserrat",
    fontSize: 14,
    paddingBottom: 4,
  },

  title: {
    fontWeight: "700",
    marginTop: 5,
    fontFamily: "montserrat-bold",
    fontSize: 16,

  },
});

export default React.memo(Checkout);
