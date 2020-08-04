import React from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Dimensions,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import moment from "moment";

import colors from "../config/colors";

const OrderTile = ({ order, index }) => {
	return (
		<TouchableOpacity
			style={[
				styles.container,
				{
					backgroundColor: order.status === "new" ? colors.ascent : colors.tile,
				},
			]}
		>
			<Text style={{ fontWeight: "600" }}>{index}</Text>
			{order.status === "new" ? (
				<Text>Order processing</Text>
			) : (
				<Text>
					{moment(order.orderPlaced).format("MMMM Do YYYY, h:mm:ss a")}
				</Text>
			)}

			<Text style={{ fontWeight: "600" }}>Total: ${order.totalAmount}</Text>
			<EvilIcons name="chevron-right" size={35} color={colors.ascent} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get("screen").height * 0.1,
		width: "100%",
		backgroundColor: colors.tile,
		borderBottomWidth: 0.3,
		borderColor: colors.primary,
		shadowColor: colors.primary,
		shadowOffset: { width: 3, height: 3 },
		shadowOpacity: 0.7,
		justifyContent: "space-evenly",
		alignItems: "center",
		flexDirection: "row",
		paddingHorizontal: 15,
	},
});

export default OrderTile;
