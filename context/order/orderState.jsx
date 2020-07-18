import React, { useReducer } from "react";
import OrderReducer from "./orderReducer";
import OrderContex from "./orderContext";
import { db } from "../../services/database";
import { GET_ORDERS } from "../types";

const OrdersState = (props) => {
  const initialState = {
    orders: [],
    order: null,
    loading: false,
  };

  const [state, dispatch] = useReducer(OrderReducer, initialState);

  const getOrders = async () => {
    const data = await (await db.collection("orders").get()).forEach(
      (order) => {
        let docs = [];
        if (order.exists) {
          docs.push({
            id: order.id,
            ...order.data(),
          });
        }
        dispatch({ type: GET_ORDERS, payload: docs });
      }
    );
  };

  return (
    <OrderContex.Provider
      value={{
        orders: state.orders,
        order: state.order,
        loading: state.loading,
        getOrders,
      }}
    >
      {props.children}
    </OrderContex.Provider>
  );
};

export default OrdersState;
