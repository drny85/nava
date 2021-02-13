import React, { useContext, useLayoutEffect, useRef } from "react";
import { View, Alert } from "react-native";
import ordersContext from "../../context/order/orderContext";
import authContext from "../../context/auth/authContext";

import Loader from "../../components/Loader";
import { STRIPE } from "../../config/stripeSettings";
import { WebView } from "react-native-webview";
import { stripeCheckoutRedirectHTML } from "../StripeCheckout";
import Signin from "../profiles/Signin";
import cartContext from "../../context/cart/cartContext";
import { COLORS } from "../../config";

import { Ionicons } from '@expo/vector-icons';

const OrderVerification = ({ navigation, route }) => {
  const { placeOrder } = useContext(ordersContext);
  const { clearCart } = useContext(cartContext);
  const { user, loading } = useContext(authContext);
  const { newOrder, paymentMethod, public_key } = route.params;
  const items = JSON.stringify(newOrder.items);

  const webRef = useRef(null);

  if (!user) {
    return <Signin />;
  }

  useLayoutEffect(() => {
    navigation.setOptions({

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
  }, [navigation])

  if (loading) return <Loader />;

  // TODO: this should come from some service/state store

  const onSuccessHandler = async () => {
    try {
      const { data, error } = await placeOrder(newOrder);

      if (error) {
        console.log(error),
          navigation.goBack()
        return;
      }

      clearCart();
      navigation.navigate("OrderConfirmation", { paymentMethod, order: data });
      /* TODO: do something */
    } catch (error) {
      console.log("Error processing payment", error);
    }
  };
  const onCanceledHandler = () => {
    /* TODO: do something */
    navigation.goBack();
  };

  const handleChange = (newState) => {
    const { url } = newState;

    if (url.includes("/success")) {
      webRef.current.stopLoading();
      //resetCartNavigation();
      //maybe close this view?
    } else {
      console.log("processing");

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

    // if (nativeEvent.url == "about:blank") {
    // 	console.log("BLANK");
    // 	navigation.goBack();
    // }
  };

  // Render
  if (!user) {
    return null;
  }

  return (
    <WebView
      ref={webRef}
      originWhitelist={["*"]}
      source={{ html: stripeCheckoutRedirectHTML(newOrder, items, public_key) }}
      onLoadStart={onLoadStart}
      onNavigationStateChange={handleChange}
    />
  );
};



export default OrderVerification;
