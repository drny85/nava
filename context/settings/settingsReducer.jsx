import { SET_DELIVERY, SET_REDIRECT, CLEAR_SETTINGS } from "../types";

export default (state, action) => {
	switch (action.type) {
		case SET_DELIVERY:
			return {
				...state,
				deliveryMethod: action.payload,
			};

		case SET_REDIRECT:
			return {
				...state,
				previewRoute: action.payload,
			};

		case CLEAR_SETTINGS:
			return {
				...state,
				previewRoute: null,
			};

		default:
			return state;
	}
};
