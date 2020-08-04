// @ts-nocheck
import React, { useReducer } from "react";
import OrderReducer from "./orderReducer";
import OrderContex from "./orderContext";
import { db } from "../../services/database";
import { GET_ORDERS, SET_LOADING } from "../types";
import { diffClamp } from "react-native-reanimated";

const OrdersState = (props) => {
	const initialState = {
		orders: [],
		order: null,
		loading: false,
	};

	const [state, dispatch] = useReducer(OrderReducer, initialState);

	const placeOrder = async (orderInfo) => {
		setLoading();

		let newOrder;
		if (orderInfo.type === "pickup") {
			newOrder = {
				userId: orderInfo.userId,
				items: orderInfo.items,
				customer: {
					address: {
						street: null,
						apt: null,
						city: null,
						zipcode: null,
					},
					phone: orderInfo.customer.phone,
					name: orderInfo.customer.name,
					lastName: orderInfo.customer.lastName,
					email: null,
				},

				orderPlaced: orderInfo.orderPlaced,
				totalAmount: orderInfo.totalAmount,
				orderType: orderInfo.type,
				status: orderInfo.status,
				paymentMethod: orderInfo.paymentMethod,
				orderPlaced: new Date().toISOString(),
			};
		} else {
			newOrder = {
				userId: orderInfo.userId,
				items: orderInfo.items,
				customer: {
					address: {
						street: orderInfo.customer.address,
						apt: orderInfo.customer.apt,
						city: orderInfo.customer.city,
						zipcode: orderInfo.customer.zipcode,
					},
					phone: orderInfo.customer.phone,
					name: orderInfo.customer.name,
					lastName: orderInfo.customer.lastName,
					email: orderInfo.customer.email,
				},
				orderPlaced: orderInfo.orderPlaced,
				totalAmount: orderInfo.totalAmount,
				orderType: orderInfo.type,
				status: orderInfo.status,
				paymentMethod: orderInfo.paymentMethod,
				orderPlaced: new Date().toISOString(),
			};
		}

		return await db.collection("orders").add(newOrder);
	};

	const getOrders = async (userId) => {
		console.log(userId);
		try {
			setLoading();

			const snapshot = db
				.collection("orders")
				.where("userId", "==", userId)
				.orderBy("orderPlaced", "desc")
				.onSnapshot((values) => {
					let data = [];
					values.forEach((doc) => {
						let d = {
							id: doc.id,
							...doc.data(),
						};
						data.push(d);
					});
					dispatch({ type: GET_ORDERS, payload: data });
				});
			dispatch({ type: GET_ORDERS, payload: Orders });
		} catch (error) {
			console.log(error);
		}
	};

	const setLoading = () => dispatch({ type: SET_LOADING });
	return (
		<OrderContex.Provider
			value={{
				orders: state.orders,
				order: state.order,
				loading: state.loading,
				getOrders,
				placeOrder,
			}}
		>
			{props.children}
		</OrderContex.Provider>
	);
};

export default OrdersState;
