import { GET_STORES, SET_LOADING, SUBMITTING_APPLICATION } from "../types";

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

    case SUBMITTING_APPLICATION:
      return {
        ...state,
        loading: true,
      }

    default:
      return state;
  }
};
