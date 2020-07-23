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

	const createUser = async (id, name, lastName, phone) => {
		try {
			const data = await db.collection("appUser").doc(id).update({
				lastName: lastName,
				phone: phone,
				name: name,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const login = async (email, password) => {
		return await auth.signInWithEmailAndPassword(email, password);
	};

	const setUser = async (userId) => {
		try {
			const data = await db.collection("appUser").doc(userId).get();
			console.log("USER DATA", data.data());

			dispatch({ type: SIGNUP, payload: data.data() });
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
					setUser(user.uid);
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
				createUser,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;