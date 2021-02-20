// @ts-nocheck
import React, { useReducer } from "react";
import OrderReducer from "./orderReducer";
import OrderContex from "./orderContext";
import { db } from "../../services/database";
import {
  GET_ORDERS,
  ORDER_LOADING,
  SET_LOADING,
  STOP_ORDER_LOADING,
} from "../types";
import { diffClamp } from "react-native-reanimated";

const OrdersState = (props) => {
  const initialState = {
    orders: [],
    order: null,
    filtered: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(OrderReducer, initialState);

  const placeOrder = async (orderInfo) => {
    try {
      setLoading();
      const restId = orderInfo.restaurant.id;
      const tem = [];
      const orders = (await db.collection("orders").get()).forEach((doc) => {
        if (doc.exists) {
          tem.push(doc.data());
        }
      });

      const orderCount = tem.filter((order) => order.restaurant.id === restId);

      let newOrder;
      if (orderInfo.type === "pickup") {
        newOrder = {
          orderNumber: orderCount.length + 1,
          userId: orderInfo.userId,
          items: orderInfo.items,
          customer: {
            address: {
              street: null,
              apt: null,
              city: null,
              zipcode: null,
            },
            phone: orderInfo.customer.phone,
            name: orderInfo.customer.name,
            lastName: orderInfo.customer.lastName,
            email: null,
          },

          orderPlaced: orderInfo.orderPlaced,
          totalAmount: orderInfo.totalAmount,
          orderType: orderInfo.type,
          status: orderInfo.status,
          instruction: orderInfo.instruction,
          restaurant: orderInfo.restaurant,
          restaurantId: orderInfo.restaurant.id,
          paymentMethod: orderInfo.paymentMethod,
          orderPlaced: new Date().toISOString(),
        };
        console.log(newOrder)
      } else {
        newOrder = {
          userId: orderInfo.userId,
          orderNumber: orderCount.length + 1,
          items: orderInfo.items,
          customer: {
            address: {
              street: orderInfo.customer.address.street,
              apt: orderInfo.customer.address.apt,
              city: orderInfo.customer.address.city,
              zipcode: orderInfo.customer.address.zipcode,
            },
            phone: orderInfo.customer.phone,
            name: orderInfo.customer.name,
            lastName: orderInfo.customer.lastName,
            email: orderInfo.customer.email,
          },
          orderPlaced: orderInfo.orderPlaced,
          totalAmount: orderInfo.totalAmount,
          orderType: orderInfo.type,
          instruction: orderInfo.instruction,
          restaurant: orderInfo.restaurant,
          restaurantId: orderInfo.restaurant.id,
          status: orderInfo.status,
          paymentMethod: orderInfo.paymentMethod,
          orderPlaced: new Date().toISOString(),
        };
      }

      const result = await db.collection("orders").add(newOrder);
      const res = (await result.get()).data();

      // updateUnitSold(result?.id, res?.restaurantId);
      return { data: { id: result.id, ...res }, error: false };
    } catch (error) {
      console.log(error);
      return { error: true, msg: error };
    }
  };

  let ordersSubscrition;

  const getOrders = async (userId) => {
    try {
      setLoading();

      ordersSubscrition = db
        .collection("orders")
        .where("userId", "==", userId)
        .orderBy("orderPlaced", "desc")
        .onSnapshot((values) => {
          let data = [];
          values.forEach((doc) => {
            let d = {
              id: doc.id,
              ...doc.data(),
            };
            data.push(d);
          });
          dispatch({ type: GET_ORDERS, payload: data });
        });
      //dispatch({ type: GET_ORDERS, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUnitSold = async (orderId, restaurantId) => {
    const order = await db.collection("orders").doc(orderId).get();
    const items = await order.data().items;

    items.forEach(async (item) => {
      try {
        const i = await db
          .collection("items")
          .doc(restaurantId)
          .collection("items")
          .doc(item.id)
          .get();
        let unit = i.data().unitSold;

        const updated = await db
          .collection("items")
          .doc(restaurantId)
          .collection("items")
          .doc(item.id);
        await updated.update({ unitSold: parseInt(unit + item.quantity) });
      } catch (error) {
        console.error("ERROR updating units sold", error);
      }
    });
  };

  const filterOrdersBy = (criteria) => {
    dispatch({ type: "FILTER_BY", payload: criteria });
  };

  const Unsubscribe = () => {
    ordersSubscrition();
  };

  const loadingOrders = () => dispatch({ type: ORDER_LOADING });
  const stopOrdersLoading = () => dispatch({ type: STOP_ORDER_LOADING });

  const setLoading = () => dispatch({ type: SET_LOADING });
  return (
    <OrderContex.Provider
      value={{
        orders: state.orders,
        order: state.order,
        loading: state.loading,
        filtered: state.filtered,
        loadingOrders,
        stopOrdersLoading,
        getOrders,
        placeOrder,
        Unsubscribe,
        filterOrdersBy,
      }}
    >
      {props.children}
    </OrderContex.Provider>
  );
};

export default OrdersState;
