// @ts-nocheck
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  Dimensions,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button
} from "react-native";

import { Ionicons } from '@expo/vector-icons';
import { STRIPE } from '../../config/stripeSettings'
import authContext from "../../context/auth/authContext";
import Screen from "../../components/Screen";

import Order from "../../models/Order";

import ListItem from "../../components/ListItem";
import { CommonActions } from "@react-navigation/native";
import cartContext from "../../context/cart/cartContext";

import ordersContext from "../../context/order/orderContext";
import AppButton from "../../components/AppButton";
import CardSummaryItem from "../../components/CardSummaryItem";
import NetInfo from '@react-native-community/netinfo';
import storesContext from "../../context/stores/storesContext";
import Divider from "../../components/Divider";
import { COLORS, FONTS, SIZES } from "../../config";
import Loader from "../../components/Loader";
import Axios from "axios";
import FloatingButton from "../../components/FloatingButton";
import { db } from '../../services/database'
import { useStripe, StripeProvider } from '@stripe/stripe-react-native'
import { diffClamp } from "react-native-reanimated";




const OrderSummary = ({ navigation, route }) => {
  const { user } = useContext(authContext);
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [processing, setProcessing] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [public_key, setPublicKey] = useState(null)
  const { placeOrder } = useContext(ordersContext);
  const [isPaid, setIsPaid] = useState(false)
  const [serviceFee, setServiceFee] = useState(null)
  const [connected, setConnected] = useState(false)
  const [discountedPrice, setDiscountedPrice] = useState(null)
  const [couponModal, setCouponModal] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoDetails, setPromoDetails] = useState(null)
  const { cartItems, cartTotal, clearCart, loading } = useContext(
    cartContext
  );
  const status = 'new';
  const { stores } = useContext(storesContext)
  const restaurants = [...stores];
  const restaurant = restaurants.find(s => s.id === cartItems[0]?.storeId)
  const [instruction, setInstrction] = useState(null)

  const { deliveryMethod, customer, paymentMethod } = route.params;
  const person = customer
  const res = restaurant

  const generateItemDiscounted = items => {
    return items.map(item => {
      return {
        ...item,
        price: promoDetails && Number(parseFloat(item.price - (item.price * promoDetails.value / 100)).toFixed(2)),
        originalPrice: item.price
      }
    })
  }

  const handleCouponCode = async () => {
    if (promoCode === '') {
      alert('Please enter a coupon code')
      return;
    }
    try {
      const found = await (await db.collection('stores').doc(restaurant.id).collection('coupons').where('code', '==', promoCode.toLowerCase()).get()).size
      if (found === 0) {
        setPromoDetails(null)
        alert('Invalid or Expired Code')
        return
      }
      const res = await db.collection('stores').doc(restaurant.id).collection('coupons').where('code', '==', promoCode.toLowerCase()).get()
      res.forEach(doc => {
        if (doc.exists) {
          const { value, code, expires } = doc.data()
          const notExpired =
            Date.parse(expires) < Date.parse(new Date().toISOString());

          if (!notExpired) {
            const amountToApply = (cartTotal * value) / 100;
            const total = cartTotal
            const newTotal = parseFloat(total - amountToApply);
            setPromoDetails(doc.data())
            setPromoCode('')
            setDiscountedPrice(newTotal)
            Keyboard.dismiss()
          } else {
            alert('Coupon Already Expired')
            return;
          }
        }

      })

    } catch (error) {
      console.log('ERROR', error)
    }
  }

  if (!user) {
    navigation.navigate("Profile", {
      previewRoute: "Payment",
    });
  }

  const handlePayment = async () => {
    if (cartItems.length === 0) {

      navigation.dispatch(state => {
        // Remove the home route from the stack
        return CommonActions.reset({
          index: 0,
          routes: [{ name: 'CartTab' }]
        });
      });
      return;
    }

    if (!restaurant.open) {
      Alert.alert('CLOSED', 'Store already closed', [{ text: 'OK', style: 'cancel' }])
      return
    }


    try {
      const totalAmount = promoDetails ? +parseFloat(discountedPrice).toFixed(2) : cartTotal;
      const newItems = [...cartItems]
      const itemsCopy = generateItemDiscounted(newItems)

      const newOrder = new Order(
        user.id,
        promoDetails ? itemsCopy : cartItems,
        customer,
        deliveryMethod,
        totalAmount,
        paymentMethod,
        status,
        instruction,
        restaurant,
        isPaid,
        promoDetails ? { ...promoDetails, originalPrice: cartTotal } : null,
        serviceFee

      );



      if (cartItems.length > 0) {


        if (paymentMethod === "credit") {
          await initializePaymentSheet(person, res, customerId)
          await openPaymentSheet(newOrder)

        } else {

          const { data, error } = await placeOrder(newOrder);
          if (error) {
            console.log('Error at Order Summary', error)
            return;
          }
          if (data) {
            clearCart();
            navigation.navigate("Orders", {
              screen: "OrderConfirmation",
              params: { orderId: data.id, paymentMethod },
            });
          }

        }
      } else {
        Alert.alert("Empty Cart", "Cart is empty", [
          { text: "OK", style: "cancel" },
        ]);
      }
    } catch (error) {

      alert('This store is not taking cards payment at the moment. \n Please change payment method')
      navigation.goBack()
      console.log('Error @OrderSummary handling payment', error.message)
      return
    }
  };


  const initializePaymentSheet = async (person, res, id) => {
    try {
      const {
        paymentIntent,
        ephemeralKey,
        customer
      } = await fetchPaymentSheetParams(person, res, id);


      const { error } = await initPaymentSheet({
        customerId: customer,
        applePay: true,
        merchantCountryCode: 'US',
        googlePay: true,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent


      });

      if (!error) {


      }
    } catch (error) {
      console.log('Error @initialPayment', error.message)
    }

  };

  const openPaymentSheet = async (order) => {
    try {
      setProcessing(true)
      const { error } = await presentPaymentSheet({ clientSecret: public_key });


      if (error) {
        Alert.alert(`${error.code}`, error.message);
        return;
      } else {
        order.isPaid = true;
        setIsPaid(true)
        setServiceFee(restaurant.chargeCardFee ? calculateServiceFee() : null)
        order.serviceFee = restaurant.chargeCardFee ? calculateServiceFee() : null;
        const { data, error } = await placeOrder(order)
        if (error) {
          console.log('Error at Order Summary', error)
          setProcessing(false)
          return;
        }
        if (data) {

          clearCart();
          setProcessing(false)
          navigation.navigate("Orders", {
            screen: "OrderConfirmation",
            params: { orderId: data.id, paymentMethod },
          });
        }

      }
    } catch (error) {
      console.log('Error @openPaymentSheet'.error.message)
    } finally {
      setProcessing(false)
    }

  };

  const generateStripeItems = () => {

    const itemsCopy = [...cartItems]
    const allItems = promoDetails ? itemsCopy : cartItems;
    const items = allItems.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity }))
    return items

  }

  const checkIfPayingWithCredit = async () => {
    try {
      const res = await Axios.get(`${STRIPE.PUBLIC_KEY_URL}/${restaurant?.id}`)

      if (res.status === 200) {

        setPublicKey(res.data)
        //createStripeCustomer()
      } else {
        console.log(res.status)
      }
    } catch (error) {
      console.log("error paying with credit",error)
    }
  }

  const createStripeCustomer = async () => {
    try {

      const res = await Axios.post(`${STRIPE.CREATE_CUSTOMER}`, { userId: user.id, email: user.email, restaurantId: restaurant?.id })
      if (res.status === 200) {

        const { customer_id } = res.data
        setCustomerId(customer_id)
      }


    } catch (error) {
      console.log(error)
    }
  }


  const fetchPaymentSheetParams = async (person, res, id) => {
    try {

      const totalAmount = promoDetails ? +parseFloat(discountedPrice).toFixed(2) : cartTotal;

      const response = await Axios.post(`${STRIPE.MOBILE_URL}`, {
        name: person.name + ' ' + person.lastName, phone: person.phone, email: person.email,
        items: generateStripeItems(),
        amount: totalAmount, cardFee: res.chargeCardFee, customerId: id, restaurantKey: res.id, metadata: { address: JSON.stringify(person.address), userId: user.id }

      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {

        const { paymentIntent, ephemeralKey, customer } = await response.data;

        return {
          paymentIntent,
          ephemeralKey,
          customer,
        };
      } else return false;


    } catch (error) {
      console.log('Error @fectPAyment', error.message)
    }

  };



  const calculateServiceFee = () => {

    const amount = promoDetails ? +parseFloat(discountedPrice).toFixed(2) : cartTotal;
    const percent = +((amount + 0.3) / (1 - 0.029));
    const fee = +(amount - percent).toFixed(2) * 100;
    const finalFee = Math.round(Math.abs(fee)) / 100;

    return finalFee
  }

  const calculateGrandTotal = () => {
    const amount = promoDetails ? +parseFloat(discountedPrice).toFixed(2) : cartTotal;
    const total = amount + calculateServiceFee()

    return +total.toFixed(2);
  }


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(netInfo => {
      const { isConnected, isInternetReachable } = netInfo
      createStripeCustomer()
      if (isConnected && isInternetReachable) {
        checkIfPayingWithCredit()
        setConnected(true)

      }
    })

    return () => {
      setCouponModal(false)
      setPublicKey(null)
      setPromoDetails(null)
      setProcessing(false)
      unsubscribe && unsubscribe()
    }
  }, [connected])

  useEffect(() => {
    if (person && res && customerId) {

      initializePaymentSheet(person, res, customerId)
    }
    return () => {
      //setCustomerId(null)

    }
  }, [customerId])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: connected ? 'Order Summary' : 'No Internet',
      headerLeft: () => {
        return <Ionicons
          style={{ marginLeft: 12 }}
          onPress={() => navigation.goBack()}
          name="md-arrow-back"
          color={COLORS.secondary}
          size={30}
        />
      }
    })
  }, [navigation, connected])

  console.log(processing)
  if (loading || !customerId) return <Loader />

  if (public_key) return (
    <StripeProvider publishableKey={public_key} merchantIdentifier='net.robertdev.melendez-antojito1'>
      <Screen >
        <View style={{ flex: 1, height: SIZES.height * 0.9 }}>

          {!connected && (
            <View style={{ alignContent: 'center', justifyContent: 'center', width: '100%', height: 60, backgroundColor: COLORS.ascent }}>
              <Text style={{ ...FONTS.h3, textAlign: 'center' }}>No Internet Connection</Text>
            </View>
          )}
          <View style={[styles.listView]}>
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
              data={promoDetails ? generateItemDiscounted(cartItems) : cartItems}
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
          {/* //add coupon view */}
          {restaurant?.chargeCardFee && paymentMethod === 'credit' && (
            <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 12 }}>
              <Text style={{ ...FONTS.body5, fontSize: 11 }}>Service Fee: ${calculateServiceFee()} </Text>
              <Text style={{ ...FONTS.h4 }}>Total: ${calculateGrandTotal()}</Text>
            </View>
          )}
          <View style={{ height: promoDetails ? 60 : 35, alignItems: 'flex-start', marginLeft: SIZES.padding * 0.5 }}>
            <Button disabled={promoDetails !== null} title='Add Coupon' onPress={() => setCouponModal(true)} />
            {promoDetails && (
              <View style={{ width: SIZES.width, height: 25, flexDirection: 'row', alignItems: 'center', marginLeft: SIZES.padding * 0.3, }}>
                <Text style={{ color: 'green', ...FONTS.body5 }}>Promo code {promoDetails?.code.toUpperCase()} was applied - {promoDetails?.value}%</Text>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                  setPromoCode('')
                  setCouponModal(false)
                  setDiscountedPrice(null)
                  setPromoDetails(null)

                }} >
                  <Text style={{ color: 'red', marginLeft: 10, fontSize: 20, textAlign: 'center' }}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={100} behavior='padding'>
            <ScrollView bounces={true} style={styles.details}>
              {deliveryMethod === "pickup" ? (
                <>
                  <Text
                    style={{
                      ...FONTS.h4,
                      marginBottom: 20,
                    }}
                  >
                    Important information about your order {customer.name}
                  </Text>
                  <Text style={{ ...FONTS.body5 }}>
                    You will be picking up this order at the restaurant
            </Text>
                </>
              ) : (
                  <>
                    <View>
                      <CardSummaryItem
                        onPress={() => navigation.goBack()}
                        title="Your order will be delivered to:"
                        subtitle={`${customer.address.street} ${customer.address.apt && customer.address.apt
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
                <View>
                  <Text style={{ ...FONTS.body5 }}>
                    You will pay with debit or credit card, please have it ready.
            </Text>
                  <Divider />
                  <Text style={[styles.text]}>
                    Just click Pay Now at the bottom to enter your card information.
            </Text>
                </View>
              )}
              {paymentMethod === "in store" && deliveryMethod === "pickup" && (
                <View style={[styles.pickup, { alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ ...FONTS.body5 }}>
                    You will pay for this order at the store
            </Text>
                  <Text style={{ ...FONTS.body5 }}>
                    You can pay with cash or credit / debit card
            </Text>
                  <View style={styles.totalView}>
                    <Text style={[styles.title, { paddingBottom: 10 }]}>Order Total</Text>
                    <View style={{ flexDirection: 'row', justifyContent: promoDetails ? 'space-evenly' : 'center', width: SIZES.width }}>
                      <Text style={{ fontWeight: "bold", fontSize: 34, textDecorationLine: promoDetails ? 'line-through' : 'none', textDecorationColor: 'red', color: promoDetails ? 'red' : COLORS.secondary, textDecorationStyle: 'solid', opacity: promoDetails ? 0.6 : 1 }}>
                        ${cartTotal.toFixed(2)}
                      </Text>
                      {promoDetails && (<Text style={{ fontWeight: "bold", fontSize: 34 }}>${discountedPrice?.toFixed(2)}</Text>)}
                    </View>

                  </View>
                </View>
              )}
              {paymentMethod === "cash" && deliveryMethod === "delivery" && (
                <View style={styles.infoView}>
                  <Text style={styles.infotext}>
                    Your order total is ${promoDetails ? parseFloat(discountedPrice).toFixed(2) : cartTotal.toFixed(2)}, please have this
              amount available in cash. Always be generous and tip the delivery
              guy.
            </Text>
                </View>
              )}


            </ScrollView>
          </KeyboardAvoidingView>

          <Modal onDismiss={() => setPromoCode('')} visible={couponModal} animationType='slide' style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: SIZES.height, width: SIZES.width }}>
            <View style={{ position: 'absolute', top: 60, left: 20, zIndex: 99 }}>
              <FloatingButton iconName="x" onPress={() => setCouponModal(false)} />
            </View>
            <View style={{ flex: 1, height: SIZES.height * 0.9, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ ...FONTS.body2, paddingBottom: 25 }}>Coupon Code</Text>
              <TextInput style={{
                width: '90%', backgroundColor: COLORS.ascent, padding: SIZES.padding * 0.7,
                borderRadius: SIZES.padding * 0.7 * 2, color: COLORS.white, marginBottom: SIZES.padding * 0.7
              }} autoCapitalize={'characters'} placeholderTextColor={COLORS.secondary}
                onChangeText={text => setPromoCode(text.toUpperCase())} value={promoCode} placeholder="Enter Promo Code" />
              {promoDetails && (<Text style={{ ...FONTS.body5, color: 'green' }}>{`${promoDetails.code.toUpperCase()} was applied. ${promoDetails.value}% off`}</Text>)}
              <Button title={promoDetails ? 'Done' : 'Apply Coupon'} onPress={promoDetails ? () => setCouponModal(false) : handleCouponCode} />
            </View>


          </Modal>

        </View>
        <View style={{ bottom: 8, width: "100%", height: SIZES.height * 0.08 }}>
          <AppButton
            disabled={!connected || processing}
            style={{ width: '90%', alignSelf: 'center', position: 'absolute', bottom: 5 }}
            title={paymentMethod === "credit" ? `Pay $${calculateGrandTotal()}` : processing ? 'Processing..' : "Place Order"}
            onPress={handlePayment}
          />

        </View>
      </Screen>
    </StripeProvider>
  )

  if (!public_key) return (
    
      <Screen >
        <View style={{ flex: 1, height: SIZES.height * 0.9 }}>

          {!connected && (
            <View style={{ alignContent: 'center', justifyContent: 'center', width: '100%', height: 60, backgroundColor: COLORS.ascent }}>
              <Text style={{ ...FONTS.h3, textAlign: 'center' }}>No Internet Connection</Text>
            </View>
          )}
          <View style={[styles.listView]}>
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
              data={promoDetails ? generateItemDiscounted(cartItems) : cartItems}
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
          {/* //add coupon view */}
          {restaurant?.chargeCardFee && paymentMethod === 'credit' && (
            <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 12 }}>
              <Text style={{ ...FONTS.body5, fontSize: 11 }}>Service Fee: ${calculateServiceFee()} </Text>
              <Text style={{ ...FONTS.h4 }}>Total: ${calculateGrandTotal()}</Text>
            </View>
          )}
          <View style={{ height: promoDetails ? 60 : 35, alignItems: 'flex-start', marginLeft: SIZES.padding * 0.5 }}>
            <Button disabled={promoDetails !== null} title='Add Coupon' onPress={() => setCouponModal(true)} />
            {promoDetails && (
              <View style={{ width: SIZES.width, height: 25, flexDirection: 'row', alignItems: 'center', marginLeft: SIZES.padding * 0.3, }}>
                <Text style={{ color: 'green', ...FONTS.body5 }}>Promo code {promoDetails?.code.toUpperCase()} was applied - {promoDetails?.value}%</Text>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                  setPromoCode('')
                  setCouponModal(false)
                  setDiscountedPrice(null)
                  setPromoDetails(null)

                }} >
                  <Text style={{ color: 'red', marginLeft: 10, fontSize: 20, textAlign: 'center' }}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={100} behavior='padding'>
            <ScrollView bounces={true} style={styles.details}>
              {deliveryMethod === "pickup" ? (
                <>
                  <Text
                    style={{
                      ...FONTS.h4,
                      marginBottom: 20,
                    }}
                  >
                    Important information about your order {customer.name}
                  </Text>
                  <Text style={{ ...FONTS.body5 }}>
                    You will be picking up this order at the restaurant
            </Text>
                </>
              ) : (
                  <>
                    <View>
                      <CardSummaryItem
                        onPress={() => navigation.goBack()}
                        title="Your order will be delivered to:"
                        subtitle={`${customer.address.street} ${customer.address.apt && customer.address.apt
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
                <View>
                  <Text style={{ ...FONTS.body5 }}>
                    You will pay with debit or credit card, please have it ready.
            </Text>
                  <Divider />
                  <Text style={[styles.text]}>
                    Just click Pay Now at the bottom to enter your card information.
            </Text>
                </View>
              )}
              {paymentMethod === "in store" && deliveryMethod === "pickup" && (
                <View style={[styles.pickup, { alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ ...FONTS.body5 }}>
                    You will pay for this order at the store
            </Text>
                  <Text style={{ ...FONTS.body5 }}>
                    You can pay with cash or credit / debit card
            </Text>
                  <View style={styles.totalView}>
                    <Text style={[styles.title, { paddingBottom: 10 }]}>Order Total</Text>
                    <View style={{ flexDirection: 'row', justifyContent: promoDetails ? 'space-evenly' : 'center', width: SIZES.width }}>
                      <Text style={{ fontWeight: "bold", fontSize: 34, textDecorationLine: promoDetails ? 'line-through' : 'none', textDecorationColor: 'red', color: promoDetails ? 'red' : COLORS.secondary, textDecorationStyle: 'solid', opacity: promoDetails ? 0.6 : 1 }}>
                        ${cartTotal.toFixed(2)}
                      </Text>
                      {promoDetails && (<Text style={{ fontWeight: "bold", fontSize: 34 }}>${discountedPrice?.toFixed(2)}</Text>)}
                    </View>

                  </View>
                </View>
              )}
              {paymentMethod === "cash" && deliveryMethod === "delivery" && (
                <View style={styles.infoView}>
                  <Text style={styles.infotext}>
                    Your order total is ${promoDetails ? parseFloat(discountedPrice).toFixed(2) : cartTotal.toFixed(2)}, please have this
              amount available in cash. Always be generous and tip the delivery
              guy.
            </Text>
                </View>
              )}


            </ScrollView>
          </KeyboardAvoidingView>

          <Modal onDismiss={() => setPromoCode('')} visible={couponModal} animationType='slide' style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: SIZES.height, width: SIZES.width }}>
            <View style={{ position: 'absolute', top: 60, left: 20, zIndex: 99 }}>
              <FloatingButton iconName="x" onPress={() => setCouponModal(false)} />
            </View>
            <View style={{ flex: 1, height: SIZES.height * 0.9, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ ...FONTS.body2, paddingBottom: 25 }}>Coupon Code</Text>
              <TextInput style={{
                width: '90%', backgroundColor: COLORS.ascent, padding: SIZES.padding * 0.7,
                borderRadius: SIZES.padding * 0.7 * 2, color: COLORS.white, marginBottom: SIZES.padding * 0.7
              }} autoCapitalize={'characters'} placeholderTextColor={COLORS.secondary}
                onChangeText={text => setPromoCode(text.toUpperCase())} value={promoCode} placeholder="Enter Promo Code" />
              {promoDetails && (<Text style={{ ...FONTS.body5, color: 'green' }}>{`${promoDetails.code.toUpperCase()} was applied. ${promoDetails.value}% off`}</Text>)}
              <Button title={promoDetails ? 'Done' : 'Apply Coupon'} onPress={promoDetails ? () => setCouponModal(false) : handleCouponCode} />
            </View>


          </Modal>

        </View>
        <View style={{ bottom: 8, width: "100%", height: SIZES.height * 0.08 }}>
          <AppButton
            disabled={!connected || processing}
            style={{ width: '90%', alignSelf: 'center', position: 'absolute', bottom: 5 }}
            title={paymentMethod === "credit" ? `Pay $${calculateGrandTotal()}` : processing ? 'Processing..' : "Place Order"}
            onPress={handlePayment}
          />

        </View>
      </Screen>
    
  )
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
    marginBottom: 20,
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
    padding: 8,
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
