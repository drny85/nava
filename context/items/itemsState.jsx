// @ts-nocheck
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
import React, { useReducer } from "react";
import ItemsReducer from "./itemsReducer";
import ItemsContext from "./itemsContext";
import { db } from "../../services/database";

const ItemsState = (props) => {
	const initialState = {
		items: [],
		current: null,
		filtered: null,
		loading: false,
	};

	const [state, dispatch] = useReducer(ItemsReducer, initialState);

	const getItems = async () => {
		try {
			console.log("getting items");
			setLoading();
			const snapshot = await db
				.collection("items")
				.where("available", "==", true)
				.onSnapshot((values) => {
					let data = [];
					values.forEach((doc) => {
						let d = {
							id: doc.id,
							...doc.data(),
						};
						data.push(d);
					});
					dispatch({ type: GET_ITEMS, payload: data });
				});
		} catch (error) {
			console.log(error);
		}
	};
	const filterItemsByCategory = (text) => {
		setLoading();
		dispatch({ type: FILTER_ITEMS_BY_CATEGORY, payload: text });
	};

	const clearItemsFilters = () => {
		setLoading();
		dispatch({ type: CLEAR_ITEMS_FILTERS });
	};

	const filterByName = (text) => {
		setLoading();
		dispatch({ type: SEARCH_BY_NAME, payload: text });
	};

	const setCurrent = (item) => {
		setLoading();
		dispatch({ type: SET_CURRENT_ITEM, payload: item });
	};

	const clearCurrent = () => {
		setLoading();
		dispatch({ type: CLEAR_CURRENT_ITEM });
	};

	const changeAvailability = async (id, value) => {
		try {
			setLoading();
			await db.collection("items").doc(id).update({
				available: value,
			});
		} catch (error) {
			console.log(error);
		}
	};

	// @ts-ignore
	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<ItemsContext.Provider
			value={{
				items: state.items,
				current: state.current,
				loading: state.loading,
				filtered: state.filtered,

				getItems,
				setLoading,
				clearItemsFilters,
				filterItemsByCategory,
				filterByName,
				setCurrent,
				clearCurrent,
				changeAvailability,
			}}
		>
			{props.children}
		</ItemsContext.Provider>
	);
};

export default ItemsState;
