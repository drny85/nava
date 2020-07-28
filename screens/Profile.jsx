// @ts-nocheck
import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Screen from "../components/Screen";
import ordersContext from "../context/order/orderContext";

import constants from "../config/constants";
import Signin from "./Signin";
import authContext from "../context/auth/authContext";
import Loader from "../components/Loader";

const Profile = ({ route }) => {
	const { orders, getOrders } = useContext(ordersContext);
	const { user, loading } = useContext(authContext);
	const previewRoute = route;
	console.log('PRE',previewRoute);

	useEffect(() => {
		//getOrders();
	}, []);


	if (!user) {
		return <Signin />;
	}

	if (loading) return <Loader />;
	return (
		<Screen style={styles.container}>
			<View style={styles.imageView}>
				<Image
					style={styles.img}
					source={require("../assets/images/profile.jpg")}
					resizeMode="contain"
				/>
			</View>
			<View>
				<Text>{user.name}</Text>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,

		alignItems: "center",
	},
	imageView: {
		width: "100%",
		height: constants.heigth * 0.3,
	},
	img: {
		width: "100%",
		height: "100%",
	},
});

export default Profile;
