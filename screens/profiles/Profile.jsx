import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Screen from "../../components/Screen";

const Profile = () => {
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
