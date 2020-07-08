// @ts-nocheck
import {
	SET_LOADING,
	GET_CATEGORIES,
	CATEGORY_ERROR,
	SET_CATEGORY,
	CLEAR_CATEGORY,
	UPDATE_CATEGORY,
	FILTER_BY_CATEGORY,
	CLEAR_CATEGORY_FILTERS,
	CLEAR_CATEGORY_ERROR,
} from "../types";
import React, { useReducer } from "react";
import CategoryReducer from "./categoryReducer";
import CategoryContext from "./categoryContext";

import { db } from "../../services/database";
const CategoryState = (props) => {
	const initialState = {
		categories: [],
		current: null,
		filtered: null,
		loading: false,
		error: null,
	};

	const [state, dispatch] = useReducer(CategoryReducer, initialState);

	const getCategories = async () => {
		try {
			setLoading();
			const snapshot = await db.collection("categories").get();
			const temp = snapshot.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data(),
				};
			});

			// @ts-ignore
			dispatch({ type: GET_CATEGORIES, payload: temp });
		} catch (error) {
			console.log(error);
		}
	};

	const setCategory = async (id) => {
		try {
			setLoading();
			const doc = db.collection("categories").doc(id).get();
			const category = (await doc).data();

			dispatch({ type: SET_CATEGORY, payload: { id: id, ...category } });
		} catch (error) {
			dispatch({ type: CATEGORY_ERROR, payload: "no category found" });
		}
	};

	const clearCategoryError = () => dispatch({ type: CLEAR_CATEGORY_ERROR });

	const clearFilters = () => dispatch({ type: CLEAR_CATEGORY_FILTERS });

	const clearCategory = () => dispatch({ type: CLEAR_CATEGORY });
	// @ts-ignore
	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<CategoryContext.Provider
			value={{
				categories: state.categories,
				current: state.current,
				loading: state.loading,
				error: state.error,

				getCategories,
				setLoading,
				setCategory,
				clearFilters,
				clearCategoryError,
			}}
		>
			{props.children}
		</CategoryContext.Provider>
	);
};

export default CategoryState;
