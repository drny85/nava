// @ts-nocheck
import React, { useReducer } from "react";
import CartReducer from "./cartReducer";
import CartContext from "./cartContext";

import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../services/database";
import {
	SET_LOADING,
	ADD_TO_CART,
	CLEAR_CART,
	GET_CART_ITEMS,
	REMOVE_FROM_CART,
} from "../types";
import ShoppingCart from "../../models/ShoppingCart";
import CarItem from "../../models/CartItem";

const CartState = (props) => {
	const initialState = {
		cartItems: [],
		cartTotal: 0,
		loading: false,
		itemCounts: 0,
		InCart: false,
	};

	const CART_ID = "cartId";

	const [state, dispatch] = useReducer(CartReducer, initialState);

	const addToCart = async (item) => {
		try {
			//setLoading();

			const cartId = await getCartId();

			const { items, quantity, total } = (
				await db.collection("carts").doc(cartId).get()
			).data();

			if (item.size) {
				const itemSizeFound = items.find(
					(i) => i.id === item.id && i.size === item.size
				);

				if (itemSizeFound) {
					//item found with same size -- update quntity
					const index = items.findIndex(
						(i) => i.id === item.id && i.size === item.size
					);

					const newItems = [...items];
					newItems[index].quantity = itemSizeFound.quantity + 1;

					dispatch({
						type: ADD_TO_CART,
						payload: {
							items: newItems,
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						},
					});
					calculateCartTotal(newItems)


					await db
						.collection("carts")
						.doc(cartId)
						.update({
							items: newItems,
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						});
					calculateCartTotal(newItems)

				} else {
					dispatch({
						type: ADD_TO_CART,
						payload: {
							items: [...items, item],
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						},
					});
					calculateCartTotal([...items, item])

					await db
						.collection("carts")
						.doc(cartId)
						.update({
							items: [...items, item],
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						});
					calculateCartTotal([...items, item])

					//item not found with same size -- add to the array

				}
			} else {
				const itemFound = items.find((i) => i.id === item.id);
				if (itemFound) {
					//item found -- update
					const index = items.findIndex((i) => i.id === item.id);
					const newItems = [...items];
					newItems[index].quantity = itemFound.quantity + 1;

					dispatch({
						type: ADD_TO_CART,
						payload: {
							items: newItems,
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						},
					});
					calculateCartTotal(newItems)


					await db
						.collection("carts")
						.doc(cartId)
						.update({
							items: newItems,
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						});
					calculateCartTotal(newItems)
				} else {
					//item no found -- add
					dispatch({
						type: ADD_TO_CART,
						payload: {
							items: [...items, item],
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						},
					});
					calculateCartTotal([...items, item])

					await db
						.collection("carts")
						.doc(cartId)
						.update({
							items: [...items, item],
							quantity: quantity + 1,
							total: +(total + +item.price).toFixed(2),
						});
					calculateCartTotal([...items, item])

				}
			}

			// getCartItems();
		} catch (error) {

			console.log("Error Adding to Cart", error);
		}
	};

	const calculateCartTotal = (items) => {
		const total = items.reduce((current, index) => current + (index.price * index.quantity), 0)
		dispatch({ type: "TOTAL", payload: total })

		return total
	}

	const deleteFromCart = async (item) => {
		try {
			const data = await AsyncStorage.getItem(CART_ID);
			const id = JSON.parse(data);
			const { items, quantity, total } = (
				await db.collection("carts").doc(id).get()
			).data();

			if (items.length === 0) return;

			if (item.size) {
				//item has size -- delete one and update
				const itemFoundWithSize = items.find(
					(i) => i.id === item.id && i.size === item.size
				);

				if (itemFoundWithSize) {
					const size = itemFoundWithSize.quantity;

					if (size > 1) {
						const index = items.findIndex(
							(i) => i.id === item.id && i.size === item.size
						);
						const updatedItems = [...items];
						updatedItems[index].quantity = itemFoundWithSize.quantity - 1;

						dispatch({
							type: REMOVE_FROM_CART,
							payload: {
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							},
						});
						calculateCartTotal(updatedItems)


						await db
							.collection("carts")
							.doc(id)
							.update({
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							});
						calculateCartTotal(updatedItems)

					} else {
						// remove from cart
						const index = items.findIndex(
							(i) => i.id === item.id && i.size === item.size
						);
						const updatedItems = [...items];
						updatedItems.splice(index, 1);

						dispatch({
							type: REMOVE_FROM_CART,
							payload: {
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							},
						});
						calculateCartTotal(updatedItems)


						await db
							.collection("carts")
							.doc(id)
							.update({
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							});
						calculateCartTotal(updatedItems)
					}

				} else {
					throw new Error("item not found in cart");
				}

				//getCartItems();
			} else {
				//item has no size -- delete one and update

				const itemFound = items.find((i) => i.id === item.id);
				if (itemFound) {
					const size = itemFound.quantity;
					if (size > 1) {
						//decrease quantity by one
						const index = items.findIndex((i) => i.id === item.id);
						const updatedItems = [...items];
						updatedItems[index].quantity = itemFound.quantity - 1;

						dispatch({
							type: REMOVE_FROM_CART,
							payload: {
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							},
						});
						calculateCartTotal(updatedItems)


						await db
							.collection("carts")
							.doc(id)
							.update({
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							});
						calculateCartTotal(updatedItems)

					} else {
						//remove item from array;

						const index = items.findIndex((i) => i.id === item.id);
						const updatedItems = [...items];
						updatedItems.splice(index, 1);

						dispatch({
							type: REMOVE_FROM_CART,
							payload: {
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							},
						});
						calculateCartTotal(updatedItems)



						await db
							.collection("carts")
							.doc(id)
							.update({
								items: updatedItems,
								quantity: quantity - 1,
								total: +(total - +item.price).toFixed(2),
							});
						calculateCartTotal(updatedItems)
					}



					//getCartItems();
				} else {
					throw new Error("Item not found in cart");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getCartItems = async () => {

		try {
			setLoading();
			const id = await getCartId();


			const { items, total, quantity } = (
				await db.collection("carts").doc(id).get()
			).data();

			const data = transforItems(items);

			dispatch({
				type: GET_CART_ITEMS,
				payload: { data, count: quantity, total },
			});

			calculateCartTotal(items)
		} catch (error) {
			console.log("Error from cart", error);
		}
	};

	//--------------------------
	const isAlreadyInCart = async (item) => {
		try {
			const id = await getCartId();
			const { items } = (await db.collection("carts").doc(id).get()).data();
			if (item.size) {
				if (items.find((i) => i.id === item.id && i.size === item.size)) {
					dispatch({ type: "IN_CART", payload: true });
				} else {
					dispatch({ type: "IN_CART", payload: false });
				}
			} else {
				if (items.find((i) => i.id === item.id)) {
					dispatch({ type: "IN_CART", payload: true });
				} else {
					dispatch({ type: "IN_CART", payload: false });
				}
			}
		} catch (error) {
			console.log("Error getting item form cart", error);
		}
	};

	const clearCart = async () => {
		try {
			setLoading();
			const d = await AsyncStorage.getItem(CART_ID);
			const id = JSON.parse(d);
			if (id) {
				await db.collection("carts").doc(id).delete();
				await AsyncStorage.removeItem(CART_ID);
			}
			dispatch({ type: CLEAR_CART });

			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	};

	const getCartId = async () => {
		try {
			let cartId;
			const data = await AsyncStorage.getItem(CART_ID);

			if (data === null) {
				const query = await db
					.collection("carts")
					.add({ items: [], quantity: 0, total: 0 });
				cartId = (await query.get()).id;
				console.log(cartId);
				await AsyncStorage.setItem(CART_ID, JSON.stringify(cartId));
			} else {
				cartId = JSON.parse(data);
				const found = (await db.collection("carts").doc(cartId).get()).exists;
				if (found) {
					cartId = JSON.parse(data);
				} else {
					await AsyncStorage.removeItem(CART_ID);
					const query = await db
						.collection("carts")
						.add({ items: [], quantity: 0, total: 0 });
					cartId = (await query.get()).id;

					await AsyncStorage.setItem(CART_ID, JSON.stringify(cartId));
				}
			}

			return cartId;
		} catch (error) {
			console.log("Error from get cart by Id", error);
		}
	};

	const transforItems = (items) => {
		let data = [];
		for (const item in items) {
			data.push(items[item]);
		}

		return data;
	};

	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<CartContext.Provider
			value={{
				cartItems: state.cartItems,
				loading: state.loading,
				cartTotal: state.cartTotal,
				itemCounts: state.itemCounts,
				InCart: state.InCart,
				addToCart,
				clearCart,
				getCartItems,
				deleteFromCart,
				isAlreadyInCart,
				calculateCartTotal,

			}}
		>
			{props.children}
		</CartContext.Provider>
	);
};

export default CartState;
