import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Alert, Text } from "react-native";
import ordersContext from "../../context/order/orderContext";
import authContext from "../../context/auth/authContext";

import Loader from "../../components/Loader";
import { STRIPE } from "../../config/stripeSettings";
import { WebView } from "react-native-webview";
import { stripeCheckoutRedirectHTML } from "../StripeCheckout";
import Signin from "../profiles/Signin";
import cartContext from "../../context/cart/cartContext";
import { COLORS, FONTS } from "../../config";
import NetInfo from '@react-native-community/netinfo';
import Spinner from '../../components/Spinner'

import { Ionicons } from '@expo/vector-icons';
import Screen from "../../components/Screen";

const OrderVerification = ({ navigation, route }) => {
  const { placeOrder } = useContext(ordersContext);
  const { clearCart } = useContext(cartContext);
  const [connected, setConnected] = useState(false)
  const [processing, setProccessing] = useState(false)
  const { user, loading } = useContext(authContext);
  const { newOrder, paymentMethod, public_key } = route.params;
  const items = JSON.stringify(newOrder.items);

  const webRef = useRef(null);

  if (!user) {
    return <Signin />;
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(netInfo => {
      const { isConnected, isInternetReachable } = netInfo
      console.log(netInfo)
      if (isConnected && isInternetReachable) {
        setConnected(true)
      }
    })
    return unsubscribe && unsubscribe()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: connected ? 'Payment' : 'No Internet',
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

  if (processing) return <Spinner />

  if (!connected && !processing) {
    return <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ ...FONTS.body2 }}>No Internet Connection</Text>
    </Screen>
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
