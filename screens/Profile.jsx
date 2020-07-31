// @ts-nocheck
import React, { useContext, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import ordersContext from "../context/order/orderContext";

import constants from "../config/constants";
import Signin from "./Signin";
import authContext from "../context/auth/authContext";
import Loader from "../components/Loader";
import colors from "../config/colors";
import ProfileItem from "../components/profile/ProfileItem";
import AppButton from "../components/AppButton";
import Axios from "axios";

const Profile = ({ route, navigation }) => {
	const { orders, getOrders } = useContext(ordersContext);
	const { user, loading } = useContext(authContext);

	const handlePayment = async () => {
		try {
			const data = await Axios.post(
				"https://us-central1-grocery-409ef.cloudfunctions.net/makePayment",
				{ user }
			);
			console.log("PAYMENT", data);
		} catch (error) {
			console.log(error);
		}
	};

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
					resizeMode="cover"
				/>
			</View>

			<ScrollView style={{ width: "100%", marginTop: 10 }}>
				<ProfileItem onPress={() => navigation.navigate("MyOrders")} />
			</ScrollView>
			<AppButton
				style={{ marginBottom: 30 }}
				title="Make Payment"
				onPress={handlePayment}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",

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
