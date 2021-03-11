import {
	ADD_ITEM,
	GET_ITEMS,
	SET_LOADING,
	FILTER_ITEMS_BY_CATEGORY,
	CLEAR_ITEMS_FILTERS,
	SEARCH_BY_NAME,
	SET_CURRENT_ITEM,
	CLEAR_CURRENT_ITEM,
	UPDATE_ITEM,
	DELETE_ITEM,
} from "../types";

export default (state, action) => {
	switch (action.type) {
		case 'MOST_POPULAR':
			return {
				...state,
				mostPopular: [...state.items.sort((a, b) => a.unitSold < b.unitSold).slice(0, 7).filter(i => i.unitSold > 0).filter(i => i.unitSold > 0)]
			}
		case ADD_ITEM:
			return {
				...state,
				items: [...state.items, action.payload],
				loading: false,
			};
		case FILTER_ITEMS_BY_CATEGORY:
			console.log("h", action.payload);
			return {
				...state,
				filtered: state.items.filter(
					(item) => item.category === action.payload
				),
				loading: false,
			};
		case CLEAR_ITEMS_FILTERS:
			return {
				...state,
				filtered: null,
				loading: false,
			};

		case 'ALL_ITEMS':
			return {
				...state,
				allItems: action.payload,
				loading: false,
			}
		case SEARCH_BY_NAME:
			return {
				...state,
				filtered: state.items.filter((item) => {
					const regex = new RegExp(`${action.payload}`, "gi");
					return (
						item.name.match(regex) ||
						item.description.match(regex) ||
						item.category.match(regex)
					);
				}),
				loading: false,
			};
		case SET_CURRENT_ITEM:
			return {
				...state,
				current: action.payload,
				loading: false,
			};

		case CLEAR_CURRENT_ITEM:
			return {
				...state,
				current: null,
				loading: false,
			};

		case GET_ITEMS:
			return {
				...state,
				items: action.payload,
				loading: false,
			};

		case DELETE_ITEM:
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload),
				loading: false,
			};

		case SET_LOADING:
			return {
				...state,
				loading: true,
			};
		case UPDATE_ITEM:
			return {
				...state,
				items: state.items.map((item) =>
					item.id === action.payload.id ? action.payload : item
				),
				loading: false,
			};

		default:
			return state;
	}
};
