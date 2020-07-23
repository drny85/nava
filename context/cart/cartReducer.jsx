import { ADD_TO_CART, SET_LOADING, CLEAR_CART, GET_CART_ITEMS } from "../types";

export default (state, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			return {
				...state,
				cartItems: action.payload,
				loading: false,
			};
		case GET_CART_ITEMS:
			return {
				...state,
				cartItems: action.payload.data,
				itemCounts: action.payload.count,
				cartTotal: action.payload.total,
				loading: false,
			};

		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case CLEAR_CART:
			return {
				...state,
				loading: false,
				cartItems: [],
				itemCounts: 0,
				cartTotal: 0,
			};

		default:
			return state;
	}
};