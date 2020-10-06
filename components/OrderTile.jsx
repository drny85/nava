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

const OrderTile = ({ order, index, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				styles.container,
				{
					backgroundColor: order.status === "new" ? colors.ascent : colors.tile,
				},
			]}
		>
			<View style={{ flexDirection: 'row', }}>
				<Text style={styles.text}>{index}</Text>
				{order.status === "new" ? (
					<Text>Order In Progress</Text>
				) : (
						<Text>
							{moment(order.orderPlaced).format("MMMM Do YYYY, h:mm:ss a")}
						</Text>
					)}
			</View>


			<Text style={{ fontWeight: "600" }}>Total: ${order.totalAmount.toFixed(2)}</Text>
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
		justifyContent: 'space-between',
		alignItems: "center",
		flexDirection: "row",
		paddingHorizontal: 10,
	},

	text: { fontWeight: "600", marginRight: 8, }
});

export default OrderTile;
