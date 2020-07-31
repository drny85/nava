import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import AppButton from "../components/AppButton";
import cartContext from "../context/cart/cartContext";
import colors from "../config/colors";
import CartItemTile from "../components/CartItemTile";
import Loader from "../components/Loader";
import authContext from "../context/auth/authContext";

const Cart = ({ navigation }) => {
  const {
    cartItems,
    getCartItems,
    loading,
    addToCart,
    cartTotal,
    itemCounts,
    deleteFromCart,
  } = useContext(cartContext);
  const { user } = useContext(authContext);

  const continueToCheckOut = () => {
    if (cartTotal < 5) {
      Alert.alert(
        "Opsss",
        `Please make a purchase greater than $5.00. You are just $${(
          5 - cartTotal
        ).toFixed(2)} away`,
        [{ text: "OK", style: "cancel" }]
      );

      return;
    }
    if (!user) {
      navigation.replace("Profile", { screen: "Login", params: "Checkout" });
      return;
    }
    navigation.navigate("Checkout", {
      cart: { cartItems, cartTotal, itemCounts },
    });
  };

  useEffect(() => {
    getCartItems();
    console.log("CART");
  }, []);

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CartItemTile
              isDisable={loading}
              onRemove={() => deleteFromCart(item)}
              onAddMore={() => addToCart(item)}
              item={item}
              onLongPress={() => navigation.navigate("ProductDetail", { item })}
            />
          )}
        />
      ) : (
        <View style={styles.noItems}>
          <Text>No Items in cart</Text>
          <AppButton
            title="Start Shopping"
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      )}

      {cartTotal > 0 && (
        <TouchableWithoutFeedback onPress={continueToCheckOut}>
          <View style={styles.cartTotalView}>
            <Text style={styles.text}>Checkout: ${cartTotal}</Text>
          </View>
        </TouchableWithoutFeedback>
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
    backgroundColor: colors.primary,
  },

  cartTotalView: {
    height: 60,
    width: "100%",
    backgroundColor: colors.ascent,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.secondary,
  },
  noItems: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Cart;
