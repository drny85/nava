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

	const createUser = async (id, name, lastName, phone, email) => {
		try {
			const data = await db.collection("appUser").doc(id).set({
				id: id,
				lastName: lastName,
				phone: phone,
				name: name,
				email: email,
				imageUrl: null,
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

	let authUnsubcribe = Function;

	const getCurrentUser = async () => {
		try {
			authUnsubcribe = auth.onAuthStateChanged((user) => {
				if (user) {
					console.log("Settingup user");
					setUser(user.uid);
				}
			});
		} catch (error) {
			console.log("Error with user", error);
		}
	};

	const saveExpoPushToken = async (userId, token) => {
		console.log("saving token");
		try {
			await db.collection("appUser").doc(userId).update({ pushToken: token });
		} catch (error) {
			console.log("ERROR SETIING TOKEN", error);
		}
	};

	const deleteUserAddress = async (add) => {
		try {
			const addresses = (
				await db.collection("appUser").doc(add.userId).get()
			).data().deliveryAddresses;
			const found = addresses.find((address) => address.id === add.id);
			if (found) {
				const newAddresses = [...addresses];
				const index = newAddresses.findIndex(
					(address) => address.id === add.id && address.userId === add.userId
				);
				newAddresses.splice(index, 1);
				await db.collection("appUser").doc(add.userId).update({
					deliveryAddresses: newAddresses,
				});

				setUser(add.userId);

				return { message: true };
			}

			return { message: false };
		} catch (error) {
			console.log("Error deleteting address", error);
			return { message: false };
		}
	};

	const saveDeliveryAddress = async (address) => {
		try {
			address.id = new Date().getTime();

			const result = await db.collection("appUser").doc(address.userId).get();

			const data = result.data();

			if (data.deliveryAddresses) {
				const found = data.deliveryAddresses.find(
					(a) =>
						a.street.toLowerCase().trim() ===
							address.street.toLowerCase().trim() &&
						a.apt.toLowerCase() === address.apt.toLowerCase() &&
						a.zipcode.trim() === address.zipcode.trim()
				);

				if (found) return { message: "Address already exist" };

				const newAddress = [...data.deliveryAddresses, address];

				const newinfo = await db
					.collection("appUser")
					.doc(address.userId)
					.update({
						deliveryAddresses: newAddress,
					});

				setUser(address.userId);
			} else {
				const info = await db
					.collection("appUser")
					.doc(address.userId)
					.update({
						deliveryAddresses: [address],
					});

				setUser(address.userId);
			}

			return { message: true };
		} catch (error) {
			console.log("Error saving delivery address", error);
			return { message: "There was an error" };
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
				authUnsubcribe,
				saveExpoPushToken,
				deleteUserAddress,
				saveDeliveryAddress,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
