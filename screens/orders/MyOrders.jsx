import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import ordersContext from "../../context/order/orderContext";
import Loader from "../../components/Loader";
import OrderTile from "../../components/OrderTile";

const MyOrders = () => {
	const { user } = useContext(authContext);
	const { orders, getOrders, loading } = useContext(ordersContext);
	console.log(loading);

	useEffect(() => {
		console.log("gettings orders");
		getOrders(user.id);
	}, []);

	if (loading) return <Loader />;

	return (
		<Screen style={styles.container}>
			<FlatList
				data={orders}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => (
					<OrderTile index={index + 1} order={item} />
				)}
			/>
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
