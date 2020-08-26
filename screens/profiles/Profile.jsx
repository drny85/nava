// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import Signin from "./Signin";
import useNotifications from "../../hooks/useNotifications";
import { Dimensions } from "react-native";
import ProfileItem from "../../components/ProfileItem";
import * as ImagePicker from "expo-image-picker";

import { Alert } from "react-native";

import { storage, db } from "../../services/database";

const Profile = ({ navigation }) => {
	const { user } = useContext(authContext);
	const [image, setImage] = useState("");
	if (!user) return <Signin />;
	user.pushToken ? null : useNotifications();
	const [hasPermission, setHasPermission] = useState(false);

	const requestPermission = async () => {
		const { granted } = await ImagePicker.requestCameraPermissionsAsync();
		if (!granted) alert("We need you camera permission");
		setHasPermission(granted);
		await handleImagePicker();
	};

	const saveOrChangeImageToDatabase = async (result) => {
		try {
			const { uri } = result;
			const ext = uri.split(".").pop();
			const filename = user.id + "-profile" + "." + ext;
			const response = await fetch(uri);
			const blob = await response.blob();

			if (user.imageUrl) {
				const ref = storage.ref(`profile/${filename}`);
				if (ref) {
					console.log("YES");
					await ref.delete();
				}
			}

			const ref = storage
				.ref(`profile/${filename}`)
				.put(blob, { contentType: "image/jpeg" });

			ref.on(
				"state_changed",
				(s) => {
					let progress = (s.bytesTransferred / s.totalBytes) * 100;
				},
				(error) => {
					console.log(error);
				},
				async () => {
					const imageUrl = await ref.snapshot.ref.getDownloadURL();
					if (imageUrl) {
						try {
							await db.collection("appUser").doc(user.id).update({ imageUrl });
						} catch (error) {
							console.log("error saving image to user", error);
						}
					}
				}
			);
		} catch (error) {
			console.log("Error from saving image", error);
		}
	};

	const handleImagePicker = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 0.6,

				allowsEditing: true,
			});
			if (!result.cancelled) {
				setImage(result.uri);
				Alert.alert(
					"Do you want to change?",
					"Are you happy with this image?",
					[
						{
							text: "Save it",
							onPress: () => saveOrChangeImageToDatabase(result),
						},
						{ text: "No", style: "cancel" },
					]
				);
			}
		} catch (error) {
			console.log("ERROR", error);
		}
	};

	useEffect(() => {
		if (user.imageUrl) {
			setImage(user.imageUrl);
		}
	}, [user]);

	return (
		<Screen style={styles.container}>
			<View style={styles.image_view}>
				<TouchableWithoutFeedback onPress={requestPermission}>
					<Image
						style={styles.img}
						source={{
							uri:
								image === ""
									? "https://lh3.googleusercontent.com/proxy/Y91ry80ZazcGvn0nVsDFO255xsRi9IVfxPsFOkZ7sMmp_TkKmMUCGusktzItJkWhjvoWuOJZcjqta9s8cx6u03HDvmkDAjwT6i0Mu8iPTm0HnjRbpQel"
									: image,
						}}
					/>
				</TouchableWithoutFeedback>
			</View>
			<View style={styles.profile_view}>
				<ProfileItem
					text="my orders"
					onPress={() => navigation.navigate("Orders")}
				/>
				<ProfileItem
					text="Personal Info"
					onPress={() => console.log("go to my personal info")}
				/>
				<ProfileItem
					text="My Delivery Address"
					onPress={() => navigation.navigate("MyAddress")}
				/>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	img: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
		borderRadius: Dimensions.get("screen").height / 2,
	},
	image_view: {
		width: Dimensions.get("screen").height * 0.3,
		height: Dimensions.get("screen").height * 0.3,
		borderRadius: Dimensions.get("screen").height / 2,
		marginVertical: 10,
	},
	profile_view: {
		flex: 1,
		height: "100%",
		width: "100%",
	},
});

export default Profile;
