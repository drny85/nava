import {
	SET_LOADING,
	GET_CATEGORIES,
	GET_CATEGORY,
	CATEGORY_ERROR,
	SET_CATEGORY,
	CLEAR_CATEGORY,
	UPDATE_CATEGORY,
	FILTER_BY_CATEGORY,
	CLEAR_CATEGORY_FILTERS,
	CLEAR_CATEGORY_ERROR,
} from "../types";

export default (state, action) => {
	switch (action.type) {
		case GET_CATEGORIES:
			return {
				...state,
				categories: action.payload,
				loading: false,
			};

		case CLEAR_CATEGORY:
			return {
				...state,
				current: null,
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
