import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import Signin from "./Signin";

const Profile = () => {
	const { user } = useContext(authContext);

	if (!user) return <Signin />;
	return (
		<Screen style={styles.container}>
			<Text>Profile</Text>
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
