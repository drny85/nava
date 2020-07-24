// @ts-nocheck
import React, { useReducer } from "react";
import settingsReducer from "./settingsReducer";
import SettingsContext from "./settingsContext";
import { SET_REDIRECT, CLEAR_SETTINGS, SET_DELIVERY } from "../types";

const SettingsState = (props) => {
	const initialState = {
		previewRoute: null,
		deliveryMethod: "delivery",
	};

	const [state, dispatch] = useReducer(settingsReducer, initialState);

	const setRoute = (routeName) =>
		dispatch({ type: SET_REDIRECT, payload: routeName });

	const setDeliveryMethod = (method) =>
		dispatch({
			type: SET_DELIVERY,
			payload: method,
		});

	const clearSettings = () => dispatch({ type: CLEAR_SETTINGS });

	return (
		<SettingsContext.Provider
			value={{
				previewRoute: state.previewRoute,
				deliveryMethod: state.deliveryMethod,
				setRoute,
				setDeliveryMethod,
				clearSettings,
			}}
		>
			{props.children}
		</SettingsContext.Provider>
	);
};

export default SettingsState;
