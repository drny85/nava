// @ts-nocheck
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, Alert } from "react-native";
import AppButton from "../../components/AppButton";
import cartContext from "../../context/cart/cartContext";
import { CommonActions } from "@react-navigation/native";
import colors from "../../config/colors";
import CartItemTile from "../../components/CartItemTile";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import authContext from "../../context/auth/authContext";
import settingsContext from "../../context/settings/settingsContext";
import Loader from "../../components/Loader";
import storesContext from "../../context/stores/storesContext";
import { COLORS } from "../../config";

const MINIMUM_DELIVERY = 10;

const Cart = ({ navigation }) => {
  const [deleting, setDeleting] = useState(false);
  const {
    cartItems,
    getCartItems,
    loading,
    addToCart,
    cartTotal,
    clearCart,
    itemCounts,
    deleteFromCart,
  } = useContext(cartContext);
  const { user } = useContext(authContext);
  const { stores } = useContext(storesContext);
  const { setRoute, clearSettings } = useContext(settingsContext);
  const restaurants = [...stores];
  const restaurant = restaurants.find((s) => s.id === cartItems[0]?.storeId);

  const continueToCheckOut = () => {
    if (cartTotal < (restaurant?.deliveryMinimum ? restaurant.deliveryMinimum : MINIMUM_DELIVERY)) {
      Alert.alert(
        "Opsss",
        `Please make a purchase greater than $${(restaurant?.deliveryMinimum ? restaurant.deliveryMinimum : MINIMUM_DELIVERY).toFixed(2)}. You are just $${(
          (restaurant?.deliveryMinimum ? restaurant.deliveryMinimum : MINIMUM_DELIVERY) - cartTotal
        ).toFixed(2)} away`,
        [{ text: "OK", style: "cancel" }]
      );

      return;
    }
    if (!user) {
      setRoute("Checkout");
      navigation.navigate("Profile", { screen: "Login", params: { restaurant } });
      return;
    }

    navigation.navigate("Checkout", {
      cart: { cartItems, cartTotal, itemCounts },
      restaurant: restaurant,
    });
  };

  const emptyCart = () => {
    Alert.alert("Are you sure?", "You want to empty the cart", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            setDeleting(true);
            const deleted = await clearCart();
            if (deleted) {
              navigation.dispatch((state) => {

                return CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'CartTab' }]
                });
              });
            }
          } catch (error) {
            console.log(error);
          } finally {
            setDeleting(false);
          }
        },
        style: "default",
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        cartItems.length > 0 && (
          <MaterialCommunityIcons
            onPress={emptyCart}
            style={{ marginRight: 8 }}
            name="delete"
            size={30}
            color={colors.ascent}
          />
        ),
    });
  }, [navigation, cartItems.length]);

  useEffect(() => {
    getCartItems();

    return () => { };
  }, []);

  if (deleting) return <Loader />;

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={cartItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <CartItemTile
              isDisable={loading}
              onRemove={async () => {
                if (cartItems.length === 1) {
                  await deleteFromCart(item);
                  navigation.dispatch((state) => {
                    // Remove the home route from the stack
                    const routes = state.routes.filter(
                      (r) => r.name === "Cart"
                    );

                    return CommonActions.reset({
                      ...state,
                      routes,
                      index: routes.length - 1,
                    });
                  });
                } else {
                  await deleteFromCart(item);
                }
              }}
              onAddMore={() => addToCart(item)}
              item={item}
            />
          )}
        />
      ) : (
          <View style={styles.noItems}>
            <Text>No Items in cart</Text>
            <AppButton
              title="Start Shopping"
              style={{ marginTop: 20, paddingHorizontal: 20 }}
              textStyle={{ fontSize: 16, fontWeight: "600" }}
              onPress={() => navigation.navigate("Restaurants")}
            />
          </View>
        )}

      {cartTotal > 0 && (
        // <TouchableWithoutFeedback onPress={continueToCheckOut}>
        //   <View style={styles.cartTotalView}>
        //     <Text style={styles.text}>Checkout: ${cartTotal}</Text>
        //   </View>
        // </TouchableWithoutFeedback>
        <AppButton
          style={{
            marginBottom: 8,
            width: "95%",
            backgroundColor: COLORS.secondary,
          }}
          title={`Checkout: $${cartTotal.toFixed(2)}`}
          onPress={continueToCheckOut}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: COLORS.secondary,
  },

  cartTotalView: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.ascent,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  noItems: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cart;
