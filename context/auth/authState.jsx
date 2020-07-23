// @ts-nocheck
import React, { useReducer } from "react";
import authReducer from "./authReducer";
import AuthContext from "./authContext";

import { auth, db } from "../../services/database";
import { SET_LOADING, SIGNUP, LOGOUT } from "../types";


const AuthState = (props) => {
	const initialState = {
		user: null,
		loading: false,
		error: null,
	};

	const [state, dispatch] = useReducer(authReducer, initialState);

	const signup = async (email, password) => {
		return await auth.createUserWithEmailAndPassword(email, password);
	};

	const login = async (email, password) => {
		return await auth.signInWithEmailAndPassword(email, password);
	};

	const setUser = async (userInfo) => {
		try {
			const data = db
				.collection("appUser")
				.doc(userInfo.id)
				.set({ ...userInfo, createdAt: new Date().toISOString() });
			dispatch({ type: SIGNUP, payload: userInfo });
		} catch (error) {
			console.log(error.message);
		}
	};

	const logout = async () => {
		setLoading();
		await auth.signOut();
		dispatch({ type: LOGOUT });
	};

	const getCurrentUser = async () => {
		try {
			auth.onAuthStateChanged((user) => {
				if (user) {
					setUser({
						id: user.uid,
						email: user.email,
					});
				} else {
					logout();
				}
			});
		} catch (error) {
			console.log("Error with user", error);
		}
	};

	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<AuthContext.Provider
			value={{
				user: state.user,
				loading: state.loading,
				error: state.error,
				signup,
				logout,
				setUser,
				login,
				getCurrentUser,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
