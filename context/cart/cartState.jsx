// @ts-nocheck
import React, { useReducer } from "react";
import CartReducer from "./cartReducer";
import CartContext from "./cartContext";

import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../services/database";
import { SET_LOADING, ADD_TO_CART, CLEAR_CART, GET_CART_ITEMS } from "../types";
import ShoppingCart from "../../models/ShoppingCart";
import CarItem from "../../models/CartItem";

const CartState = (props) => {
  const initialState = {
    cartItems: [],
    cartTotal: 0,
    loading: false,
    itemCounts: 0,
  };

  const CART_REF = db.collection("carts");

  const CART_ID = "cartId";

  const [state, dispatch] = useReducer(CartReducer, initialState);

  const addToCart = async (item) => {
    const cartId = await getCartId();

    try {
      const { items, quantity, total } = (
        await CART_REF.doc(cartId).get()
      ).data();

      const found = items[item.id];

      if (found) {
        found.quantity += 1;
        await CART_REF.doc(cartId).update({
          items: {
            ...items,
            [item.id]: found,
          },
          total: +(total + +item.price).toFixed(2),
          quantity: quantity + 1,
        });
      } else {
        //item not in cart -- add new item
        const newItems = { ...items, [item.id]: item };
        await CART_REF.doc(cartId).update({
          items: newItems,
          quantity: quantity + 1,
          total: +(total + +item.price).toFixed(2),
        });
      }

      const data = transforItems(items);
      getCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFromCart = async (item) => {
    try {
      const data = await AsyncStorage.getItem(CART_ID);
      const id = JSON.parse(data);
      const { items, quantity, total } = (await CART_REF.doc(id).get()).data();
      const found = items[item.id];
      if (found.quantity > 1) {
        --found.quantity;

        await CART_REF.doc(id).update({
          items: { ...items, [item.id]: found },
          quantity: quantity - 1,
          total: +(total - item.price).toFixed(2),
        });
        getCartItems();
      } else {
        delete items[item.id];
        await CART_REF.doc(id).update({
          items: { ...items },
          quantity: quantity - 1,
          total: +(total - item.price).toFixed(2),
        });

        getCartItems();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCartItems = async () => {
    setLoading();
    const id = await getCartId();
    const { items, total, quantity } = await (
      await CART_REF.doc(id).get()
    ).data();

    const data = transforItems(items);
    dispatch({
      type: GET_CART_ITEMS,
      payload: { data, count: quantity, total },
    });
  };

  const clearCart = async () => {
    try {
      setLoading();
      const d = await AsyncStorage.getItem(CART_ID);
      const id = JSON.parse(d);
      if (id) {
        await db.collection("carts").doc(id).delete();
        await AsyncStorage.removeItem(CART_ID);
      }
      dispatch({ type: CLEAR_CART });
    } catch (error) {
      console.log(error);
    }
  };

  const getCartId = async () => {
    let cartId;
    const data = await AsyncStorage.getItem(CART_ID);

    if (data === null) {
      const query = await CART_REF.add({ items: {}, quantity: 0, total: 0 });
      cartId = (await query.get()).id;
      await AsyncStorage.setItem(CART_ID, JSON.stringify(cartId));
    } else {
      cartId = JSON.parse(data);
    }

    return cartId;
  };

  const transforItems = (items) => {
    let data = [];
    for (const item in items) {
      data.push(items[item]);
    }

    return data;
  };

  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        loading: state.loading,
        cartTotal: state.cartTotal,
        itemCounts: state.itemCounts,
        addToCart,
        clearCart,
        getCartItems,
        deleteFromCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartState;
