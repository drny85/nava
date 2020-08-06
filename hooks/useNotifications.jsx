import { useEffect } from "react";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import { useContext } from "react";
import authContext from "../context/auth/authContext";

let pushToken = null;
export default useNotification = () => {
  const { user, saveExpoPushToken } = useContext(authContext);

  useEffect(() => {
    registerForNotification();
    // if (notificationListener) Notifications.addListener(notificationListener);
    return () => {};
  }, []);

  const saveToken = async (token) => {
    saveExpoPushToken(user.id, token);
  };

  const registerForNotification = async () => {
    try {
      let permision;
      const { granted } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      permision = granted;
      console.log("P", permision);
      if (!permision) {
        const updated = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        console.log("UPDATED", updated);
        permision = updated.granted;
        console.log("UP", permision);
      }

      console.log("GRANTED", permision);
      if (!permision) return;
      console.log("continue");
      pushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("TK", pushToken);
    } catch (error) {
      console.log("Error Saving token from useNotifications", error);
    }
  };

  return { pushToken, saveToken };
};
