import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import Signin from "./Signin";
import useNotifications from "../../hooks/useNotifications";

const Profile = () => {
	const { user } = useContext(authContext);
	if (!user) return <Signin />;
	user.pushToken ? null : useNotifications();

	return (
		<Screen style={styles.container}>
			<Text style={{textTransform: 'capitalize'}}>Welcome {user.name}</Text>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Profile;
