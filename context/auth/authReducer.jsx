import { AUTH_ERROR, LOGIN, SIGNUP, LOGOUT, SET_LOADING } from "../types";

export default (state, action) => {
  switch (action.type) {
    case SIGNUP:
    case LOGIN:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
      };

    case AUTH_ERROR:
      return {
        ...state,
        user: null,
        error: action.payload,
        loading: false,
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
