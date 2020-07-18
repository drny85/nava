import { GET_ORDERS, GET_ORDER } from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case GET_ORDER:
      return {
        ...state,
        ///send id with the payload
        order: state.orders.find((order) => order.id === action.payload),
        loading: false,
      };

    default:
      return state;
  }
};
