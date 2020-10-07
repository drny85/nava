import { GET_STORES, SET_LOADING } from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_STORES:
      return {
        ...state,
        stores: action.payload,
        loading: false,
      };

    case "SET_STORE":
      return {
        ...state,
        loading: false,
        current: action.payload,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      }

    default:
      return state;
  }
};
