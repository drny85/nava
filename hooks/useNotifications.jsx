
import * as Notifications from "expo-notifications";
import { useContext, useEffect } from "react";
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
const useNotifications = (notificationListener) => {
	const { user, saveExpoPushToken } = useContext(authContext);

	useEffect(() => {
		registerForPushNotificationsAsync();
		if (notificationListener) Notifications.addNotificationResponseReceivedListener(notificationListener)
		// return () => notificationListener && notificationListener()
	}, []);

	const saveToken = async (id, token) => {
		try {
			saveExpoPushToken(id, token);
		} catch (error) {
			console.log('Error @saving token')
		}

	};

	const registerForPushNotificationsAsync = async () => {

		try {
			if (Constant.isDevice) {
				const { status: existingStatus } = await Notifications.requestPermissionsAsync()
				let finalStatus = existingStatus;
				if (existingStatus !== "granted") {
					const { status } = await Notifications.getPermissionsAsync()
					finalStatus = status;
				}

				if (finalStatus !== "granted") {
					alert("Failed to get push token for push notification!");
					return;
				}
				const token = await Notifications.getExpoPushTokenAsync();
				const id = auth().currentUser.uid;
				if (!user?.pushToken) {
					saveToken(id, token.data)
				}

			}

			if (Platform.OS === 'android') {
				Notifications.setNotificationChannelAsync('default', {
					name: 'default',
					importance: Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: '#FF231F7C',
				});
			}

		} catch (error) {
			console.log("Error from expo hooks", error);
		}
	};
};

export default useNotifications;
