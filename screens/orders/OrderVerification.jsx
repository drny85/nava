import React, { useContext, useEffect, useRef, useState } from "react";
import ordersContext from "../../context/order/orderContext";
import authContext from "../../context/auth/authContext";

import Loader from "../../components/Loader";
import { STRIPE } from "../../config/stripeSettings";
import { WebView } from "react-native-webview";
import { stripeCheckoutRedirectHTML } from "../StripeCheckout";
import Signin from "../profiles/Signin";
import cartContext from "../../context/cart/cartContext";
import { COLORS, FONTS, SIZES } from "../../config";
import { CommonActions, StackActions, useFocusEffect } from '@react-navigation/native';

import Spinner from '../../components/Spinner'

import { Ionicons } from '@expo/vector-icons';
import logger from "../../utils/logger";
import { RefreshControlBase } from "react-native";


const OrderVerification = ({ navigation, route }) => {
  const { placeOrder } = useContext(ordersContext);
  const { clearCart } = useContext(cartContext);
  const [processing, setProccessing] = useState(false)
  const { user, loading } = useContext(authContext);
  const { newOrder, paymentMethod, public_key, cardFee } = route.params;

  const [baseUrl, setBaseUrl] = useState('https://robertdev.net')

  const webRef = useRef(null);

  if (!user) {
    return <Signin />;
  }




  if (loading) return <Loader />;

  // TODO: this should come from some service/state store

  const onSuccessHandler = async () => {
    try {
      setProccessing(true)
      newOrder.isPaid = true

      const { data, error } = await placeOrder(newOrder);

      if (error) {
        console.log(error),
          navigation.goBack()
        return;
      }

      await clearCart();
      setProccessing(false)
      navigation.navigate("OrderConfirmation", { paymentMethod, order: data });
      /* TODO: do something */
    } catch (error) {
      console.log("Error processing payment", error);
      logger.log(error)
    }
  };
  const onCanceledHandler = () => {
    /* TODO: do something */

    setBaseUrl('https://robertdev.net')


    navigation.navigate("CartTab", {
      screen: "OrderSummary",
      // params: {
      //   deliveryMethod,
      //   paymentMethod,
      //   customer: { name: user?.name, lastName: user?.lastName, email: user?.email, phone: user?.phone }
      // },
    });
  };



  const handleChange = async (newState) => {

    try {
      const { url } = newState;

      if (newState.canGoBack) {
        if (url.includes('/cancel')) {

          webRef.current.goBack()
        }

      }
      if (url.includes("/success")) {
        webRef.current.stopLoading();
        //resetCartNavigation();
        //maybe close this view?
      } else if (url.includes('/cancel')) {

        setBaseUrl('https://robertdev.net')

      }

    } catch (error) {
      console.error('Error processing payment', error)
      logger.log(error)
    }

  };

  // Called everytime the URL stats to load in the webview
  const onLoadStart = (syntheticEvent) => {

    const { nativeEvent } = syntheticEvent;

    if (nativeEvent.url === STRIPE.SUCCESS_URL) {
      onSuccessHandler();

      return;
    }
    if (nativeEvent.url === STRIPE.CANCELED_URL) {
      onCanceledHandler();
    }

  };

  // Render
  if (!user) {
    return null;
  }


  useEffect(() => {
    return () => {

      setBaseUrl('https://robertdev.net')

    }
  }, [newOrder, navigation])

  if (processing) return <Spinner />
  return (
    <WebView
      enableApplePay={true}
      cacheEnabled={false}
      cacheMode='LOAD_NO_CACHE'
      startInLoadingState={true}
      incognito={true}
      contentMode='mobile'
      style={{ marginTop: SIZES.statusBarHeight }}
      ref={webRef}
      originWhitelist={["*"]}
      source={{ html: stripeCheckoutRedirectHTML(newOrder, newOrder.items, public_key, cardFee), baseUrl: baseUrl }}
      onLoadStart={onLoadStart}
      onNavigationStateChange={handleChange}
      renderLoading={() => <Spinner />}
    />
  );
};



export default OrderVerification;
