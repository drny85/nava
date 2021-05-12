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


import AppSubmitButton from "../../components/AppSubmitButton";
import authContext from "../../context/auth/authContext";
import AppButton from "../../components/AppButton";
import { COLORS, FONTS, SIZES } from "../../config";
import storesContext from "../../context/stores/storesContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MINIMUM_DELIVERY = 10;

const Checkout = ({ route, navigation }) => {


  const [paymentOption, setPaymentOption] = useState("credit");
  const [canContinue, setCanContinue] = useState(false);
  const [error, setError] = useState(null);
  const { deliveryMethod: deliveryOption, setDeliveryMethod } = useContext(settingsContext);
  const { stores } = useContext(storesContext)
  const { user } = useContext(authContext);
  const previous = route.params?.previous;
  const { restaurant } = route.params;

  //const [deliveryOption, setDeliveryOption] = useState(deliveryMethod);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const { cartTotal, itemCounts, cartItems } = useContext(cartContext);


  const handlePickup = (pickupInfo) => {
    if (paymentOption === "cash") {
      Alert.alert("Payment", "Please select a payment method", [
        { text: "OK", style: "cancel" },
      ]);
      return;
    }

    navigation.navigate("CartTab", {
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

    if (!canContinue) {
      alert('This location do not delivery to yours')
      return
    }

    //  check cart total is greater than 10 for minimum delivery amount.
    if (deliveryOption === "delivery" && cartTotal < (restaurant?.deliveryMinimum ? restaurant.deliveryMinimum : MINIMUM_DELIVERY)) {

      Alert.alert(
        "Minimum Delivery",
        `Please spend at least $${(restaurant?.deliveryMinimum ? restaurant.deliveryMinimum : MINIMUM_DELIVERY) - cartTotal
        } more to be eligible for delivery`,
        [{ text: "OK", style: "cancel" }]
      );
      return;
    }
    navigation.navigate("CartTab", {
      screen: "OrderSummary",
      params: {
        deliveryMethod: deliveryOption,
        paymentMethod: paymentOption,
        customer: { name: user?.name, lastName: user?.lastName, email: user?.email, phone: user?.phone, address: { ...previous } },
      },
    });
  };

  //allow customer to change delivery type
  const handleDeliveryType = type => {
    switch (type) {
      case 'delivery':

        if (cartItems.length > 0) {
          const storeId = cartItems[0].storeId
          const res = stores.find(store => store.id === storeId)
          if (res.deliveryType === 'pickupOnly') {
            alert('You already have an item which store only offers pick ups. Please remove item to continue')
            return;
          }

        }
        //setDeliveryType('delivery')
        setDeliveryMethod('delivery')

        break;


      case 'pickup':

        if (cartItems.length > 0) {
          const storeId = cartItems[0].storeId
          const res = stores.find(store => store.id === storeId)
          if (res.deliveryType === 'deliveryOnly') {
            alert('You already have an item which store only offers deliveries. Please remove item to continue')
            return;
          }

        }
        // setDeliveryType('pickup')
        setDeliveryMethod('pickup')


      default:
        break;
    }
  }


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

  const getPaymentType = async () => {
    try {
      const pt = await AsyncStorage.getItem('paymentType')
      return pt ? pt : 'credit';
    } catch (error) {
      console.log(error)
      return null
    }
  }

  useEffect(() => {
    (async () => {
      checkDeliveryAddress()
      const pt = await getPaymentType()
      setPaymentOption(pt)
    })()

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

          <Text style={{ ...FONTS.h4 }}>Total Items: {itemCounts}</Text>
          <Text style={{ ...FONTS.h3, padding: SIZES.padding * 0.3 }}>Order Total: ${cartTotal.toFixed(2)}</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>Delivery Option</Text>
          <View style={styles.delivery}>
            <TouchableOpacity

              onPress={() => {
                handleDeliveryType("delivery")
                if (!deliveryAddress) {
                  setCanContinue(false)
                } else {
                  setCanContinue(true)
                }

              }}
              style={{
                height: "100%",

                backgroundColor:
                  deliveryOption === "delivery" ? COLORS.secondary : COLORS.white,
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
                        ? COLORS.white
                        : COLORS.black
                  }}
                >
                  Delivery
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider}></View>
            <TouchableOpacity

              onPress={() => {
                handleDeliveryType("pickup")
                setCanContinue(true)
              }}
              style={{
                height: "100%",

                backgroundColor:
                  deliveryOption === "pickup" ? COLORS.secondary : COLORS.white,
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
                      deliveryOption === "pickup" ? COLORS.white : COLORS.black,
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
                      paymentOption === "credit" ? COLORS.white : COLORS.black
                  }}
                  onPress={() => setPaymentOption("credit")}
                />
                <View style={styles.divider}></View>
                <Pick
                  title="cash"
                  style={{
                    color:
                      paymentOption === "cash" ? COLORS.white : COLORS.black,
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
                        paymentOption === "credit" ? COLORS.white : COLORS.black,
                    }}
                    type={paymentOption}
                    onPress={() => setPaymentOption("credit")}
                  />
                  <View style={styles.divider}></View>
                  <Pick
                    title="in store"
                    style={{
                      color:
                        paymentOption === "in store" ? COLORS.white : COLORS.black,
                    }}
                    type={paymentOption}
                    onPress={() => setPaymentOption("in store")}
                  />
                </>
              )}
          </View>
          {deliveryOption === "delivery" && (
            <View style={[styles.addressView, { height: deliveryAddress ? SIZES.height * 0.30 : SIZES.height * 0.2 }]}>
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
                    <View style={{ padding: 12 }}>
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
              {error && (<View style={{ height: 40 }}>
                <Text style={{ ...FONTS.body3, color: 'red' }}>{error}</Text>
                <Text style={{ fontStyle: 'italic', ...FONTS.body5 }}>This location only makes deliveries to these zip codes</Text>
                <View style={{ flexDirection: 'row', height: 30 }}>
                  {restaurant?.deliveryZip.map(zip => {
                    return <Text style={{ marginRight: 5, ...FONTS.body5 }} key={zip}>{zip}</Text>
                  })}
                </View>
              </View>)}

              <View style={{ height: 80 }}></View>
            </View>
          )}
        </View>




      </View>
      <View style={{ marginBottom: 15, width: "90%", }}>
        {/* <AppSubmitButton disabled={!canContinue} title="Check Out" /> */}
        <AppButton title='Check Out' onPress={deliveryOption === 'delivery' ? handleDelivery : handlePickup} />
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
    shadowColor: COLORS.ascent,
    shadowOffset: {
      width: 3,
      height: 7,
    },
    padding: 10,
    shadowOpacity: 0.7,
    marginVertical: 8,
    shadowRadius: 10,
    borderColor: "grey",
    backgroundColor: colors.tile,
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
