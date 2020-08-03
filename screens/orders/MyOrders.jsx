import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import ordersContext from "../../context/order/orderContext";
import Loader from "../../components/Loader";

const MyOrders = () => {
	const { user } = useContext(authContext);
	const { orders, getOrders, loading } = useContext(ordersContext);

	useEffect(() => {
		console.log("gettings orders");
		getOrders(user.id);
	}, []);

	if (loading) return <Loader />;

	return (
		<Screen style={styles.container}>
			<Text>My Orders {orders.length}</Text>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default MyOrders;
