// @ts-nocheck
import { useEffect } from "react";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import { useContext } from "react";
import authContext from "../context/auth/authContext";
import { Platform } from "react-native";
import { auth } from "firebase";
import Constant from "expo-constants";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

let pushToken = null;
export default useNotifications = (notificationListener) => {
	const { user, saveExpoPushToken } = useContext(authContext);

	useEffect(() => {
		registerForPushNotificationsAsync();
		if (notificationListener) Notifications.addListener(notificationListener);
		return () => {};
	}, []);

	const saveToken = async (token) => {
		saveExpoPushToken(user.id, token);
	};

	const registerForPushNotificationsAsync = async () => {
		console.log("getting token");
		try {
			if (Constant.isDevice) {
				const { status: existingStatus } = await Permissions.getAsync(
					Permissions.NOTIFICATIONS
				);
				let finalStatus = existingStatus;
				if (existingStatus !== "granted") {
					const { status } = await Permissions.askAsync(
						Permissions.NOTIFICATIONS
					);
					finalStatus = status;
				}
				console.log(finalStatus);
				if (finalStatus !== "granted") {
					alert("Failed to get push token for push notification!");
					return;
				}
				const token = await Notifications.getExpoPushTokenAsync();
				const id = auth().currentUser.uid;
				saveExpoPushToken(id, token.data);
			} else {
				alert("Must use physical device for Push Notifications");
			}

			if (Platform.OS === "android") {
				Notifications.createChannelAndroidAsync("default", {
					name: "default",
					sound: true,
					priority: "max",
					vibrate: [0, 250, 250, 250],
				});
			}
		} catch (error) {
			console.log("Error from expo hooks", error);
		}
	};
};
