import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import moment from "moment";

import Screen from "../../components/Screen";
import colors from "../../config/colors";
import ListItem from "../../components/ListItem";

const OrderDetails = ({ route }) => {
	const { order } = route.params;
	

	return (
		<Screen style={styles.container}>
			<View style={styles.orderInfo}>
				<Text style={styles.text}>
					Date: {moment(order.orderPlaced).format("LL")}{" "}
				</Text>
				<Text style={styles.text}>
					Customer: {order.customer.name} {order.customer.lastName}
				</Text>
				<Text style={styles.text}>Order Type: {order.orderType}</Text>
				<Text style={styles.text}>Payment Method: {order.paymentMethod}</Text>
				<Text style={styles.text}>
					{order.orderType === "pickup" || order.type === "pickup" ? (
						`Person Picking Up: ${order.customer.name}`
					) : (
						<Text numberOfLines={1} style={styles.text}>
							Delivered to: {order.customer.address.street},{" "}
							{order.customer.address.city}
						</Text>
					)}
				</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-around",
					marginVertical: 10,
					alignItems: "center",
				}}
			>
				<Text style={{ fontSize: 20, fontWeight: "700" }}>
					Items: {order.items.length}
				</Text>
				<Text style={{ fontSize: 20, fontWeight: "700", marginVertical: 10 }}>
					Amount: ${order.totalAmount}
				</Text>
			</View>

			<View style={{ width: "100%", marginTop: 5, flex: 1 }}>
				<FlatList
					data={order.items}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<ListItem
							name={item.name}
							imageUrl={item.imageUrl}
							qty={item.quantity}
							price={item.price}
						/>
					)}
				/>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	orderInfo: {
		marginTop: 3,
		padding: 10,

		paddingVertical: 10,
		elevation: 10,
		backgroundColor: colors.tile,
		shadowOpacity: 0.7,
		shadowOffset: { width: 5, height: 3 },
		shadowColor: colors.primary,
		width: "98%",
		justifyContent: "center",
	},
	text: {
		fontSize: 18,
		fontWeight: "500",
		paddingBottom: 8,
		textTransform: "capitalize",
	},
});

export default OrderDetails;
