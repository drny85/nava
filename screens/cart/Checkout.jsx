// @ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";

import cartContext from "../../context/cart/cartContext";
import settingsContext from "../../context/settings/settingsContext";
import Pick from "../../components/Pick";

import AppForm from "../../components/AppForm";
import AppFormField from "../../components/AppFormField";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as Animatable from 'react-native-animatable'
import AppSubmitButton from "../../components/AppSubmitButton";
import authContext from "../../context/auth/authContext";
import AppButton from "../../components/AppButton";
import { COLORS, FONTS, SIZES } from "../../config";
import storesContext from "../../context/stores/storesContext";

import useNotifications from "../../hooks/useNotifications";
import { STRIPE } from "../../config/stripeSettings";
import axios from "axios";

const MINIMUM_DELIVERY = 5;

const Checkout = ({ route, navigation }) => {

  useNotifications()
  //const [paymentOption, updatePaymentMethod] = useState("credit");
  const { user} = useContext(authContext);
  const [canContinue, setCanContinue] = useState(false);
  const { cartTotal, itemCounts, cartItems } = useContext(cartContext);
  const [error, setError] = useState(null);
  const [card, setCard] = useState(false)
  const { deliveryMethod: deliveryOption, setDeliveryMethod, updatePaymentMethod, paymentOption } = useContext(settingsContext);
  const { stores } = useContext(storesContext)
  const restaurants = [...stores];
  const restaurant = restaurants.find(s => s.id === cartItems[0]?.storeId)
  const previous = route.params?.previous;
  //const [deliveryOption, setDeliveryOption] = useState(deliveryMethod);
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  const checkIfStoreIsTakingCards = async () => {
    try {
      const res = await axios.get(`${STRIPE.PUBLIC_KEY_URL}/${restaurant?.id}`)
      if (res.data) {
        setCard(true)
      }

       
    } catch (error) {
      setCard(false)
      updatePaymentMethod('cash')
      console.log(error.message)
    }
  }


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
        takingCard: card,
        customer: { name: user?.name, lastName: user?.lastName, email: user.email, phone: user?.phone, address: null }
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
        takingCard: card,
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


  useEffect(() => {

    checkDeliveryAddress()
    checkIfStoreIsTakingCards()

    return () => {

    }

  }, [previous, route.params]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          height: SIZES.height,
          flex: 1,


        }}
      >
        <View style={{ flex: 1, width: SIZES.width, alignItems: 'center' }}>
          <Animatable.View animation='fadeInDown' easing='ease-in-cubic' style={styles.view}>

            <Text style={{ ...FONTS.h4 }}>Total Items: {itemCounts}</Text>
            <Text style={{ ...FONTS.h3, padding: SIZES.padding * 0.3 }}>Order Total: ${cartTotal.toFixed(2)}</Text>
          </Animatable.View>
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

                      ...FONTS.h2,
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
                      ...FONTS.h2,
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
                      ...FONTS.h2,
                      color:
                        paymentOption === "credit" ? COLORS.white : COLORS.black
                    }}
                    onPress={() => {
                      if (card) {
                        updatePaymentMethod("credit")
                      } else {
                        alert('This store is not taking cards payment.')
                      }
                    }}
                  />
                  <View style={styles.divider}></View>
                  <Pick
                    title="cash"
                    style={{
                      ...FONTS.h2,
                      color:
                        paymentOption === "cash" ? COLORS.white : COLORS.black,
                    }}
                    type={paymentOption}
                    onPress={() => updatePaymentMethod("cash")}
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
                      onPress={() => {
                        if (card) {
                          updatePaymentMethod("credit")
                        } else {
                          alert('This store is not taking cards payment.')
                        }
                      }}
                    />
                    <View style={styles.divider}></View>
                    <Pick
                      title="in store"
                      style={{
                        color:
                          paymentOption === "in store" ? COLORS.white : COLORS.black,
                      }}
                      type={paymentOption}
                      onPress={() => updatePaymentMethod("in store")}
                    />
                  </>
                )}
            </View>
            {deliveryOption === 'delivery' && (
              <View style={{ width: '100%', marginVertical: SIZES.padding * 0.5, alignItems: 'center', }}>
                <TouchableOpacity onPress={() => navigation.navigate("MyAddress", { previous: "Checkout" })} style={{ alignSelf: 'center', backgroundColor: COLORS.light, paddingHorizontal: SIZES.padding * 0.8, paddingVertical: SIZES.padding * 0.4, borderRadius: SIZES.padding, }}>
                  <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>
                    {deliveryAddress ? 'Change Address' : 'Select Address'}
                  </Text>
                </TouchableOpacity>
                <View style={{ marginVertical: SIZES.padding * 0.3, justifyContent: 'center', width: SIZES.width, }}>
                  {deliveryAddress ? (
                    <View style={{ ...SIZES.shadow, width: '96%', alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Text style={styles.deliveryText}>
                        {deliveryAddress.street}{" "}
                        {deliveryAddress.apt
                          ? `, Apt ${deliveryAddress.apt}`
                          : null}
                      </Text>
                      <Text style={styles.deliveryText}>
                        {deliveryAddress.city}, {deliveryAddress.zipcode}
                      </Text>
                    </View>
                  ) : null}

                </View>
              </View>)}
            {error && (<View style={{ marginBottom: 10, flex: 1, width: '100%', marginHorizontal: SIZES.padding * 0.5 }}>
              <Text style={{ ...FONTS.body3, color: 'red' }}>{error}</Text>
              <Text style={{ fontStyle: 'italic', ...FONTS.body5, }}>This location only makes deliveries to these zip codes</Text>
              <View style={{ flexDirection: 'row', height: 30 }}>
                {restaurant?.deliveryZip.map(zip => {
                  return <Text style={{ marginRight: 5, ...FONTS.body5 }} key={zip}>{zip}</Text>
                })}
              </View>
              <View style={{ marginBottom: 30 }}></View>
            </View>
            )}
          </View>
          <View style={{ height: 40, width: '100%' }}></View>
        </View>


      </ScrollView>
      <View style={{ width: "100%", position: 'absolute', left: 0, right: 0, bottom: 20, justifyContent: 'center', alignItems: 'center' }}>
        {/* <AppSubmitButton disabled={!canContinue} title="Check Out" /> */}
        <AppButton style={{ width: '90%' }} title='Check Out' onPress={deliveryOption === 'delivery' ? handleDelivery : handlePickup} />
      </View>
    </View>

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
    backgroundColor: COLORS.secondary,
  },

  delivery: {
    overflow: "hidden",
    width: "95%",
    height: SIZES.height * 0.06,
    borderRadius: 50,
    backgroundColor: COLORS.tile,
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
    height: SIZES.height * 0.15,
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
    borderColor: COLORS.gray,
    backgroundColor: COLORS.tile,
  },

  pickAddress: {
    width: SIZES.width,
    height: SIZES.height * 0.13,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: COLORS.secondary,
    borderBottomColor: COLORS.secondary,
    justifyContent: "space-between",
    flexDirection: "row",

    alignItems: "center",
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

export default Checkout;
