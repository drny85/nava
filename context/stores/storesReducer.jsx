import { GET_STORES } from "../types";


export default (state, action) => {
    switch (action.type) {
        case GET_STORES:
            return {
                ...state,
                stores: action.payload,
                loading: false
            };

        default:
            return state;
    }
}