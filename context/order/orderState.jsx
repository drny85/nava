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
		try {
			setLoading();
			let Orders = [];
			const data = await db
				.collection("orders")
				.where("userId", "==", userId)
				.orderBy("orderPlaced", "desc")
				.get();

			data.forEach((doc) => {
				if (doc.exists) {
					Orders.push({
						id: doc.id,
						...doc.data(),
					});
				}

				dispatch({ type: GET_ORDERS, payload: Orders });
			});
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
