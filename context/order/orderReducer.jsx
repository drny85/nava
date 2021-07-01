import {
  GET_ORDERS,
  GET_ORDER,
  SET_LOADING,
  ORDER_LOADING,
  STOP_ORDER_LOADING,
} from "../types";

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
        order: action.payload,
        loading: false,
      };

    case ORDER_LOADING:
      return {
        ...state,
        loading: true,
      };

    case STOP_ORDER_LOADING:
      return {
        ...state,
        loading: false,
      };

    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
        error: null,
      };

    case "FILTER_BY":
      const ordersCopy = [...state.orders];
      return {
        ...state,
        filtered:
          action.payload === "price"
            ? ordersCopy.sort((a, b) => a.totalAmount > b.totalAmount)
            : ordersCopy.sort(
              (a, b) =>
                new Date(a.orderPlaced).getMilliseconds() >
                new Date(b.orderPlaced).getMilliseconds()
            ),
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};
