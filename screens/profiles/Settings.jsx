// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AppButton from "../../components/AppButton";
import Swipeable from "react-native-gesture-handler/Swipeable";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Settings = () => {
  const showNotification = async () => {
    const { granted } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (granted) return;
  };
  return (
    <View style={styles.screen}>
      <Swipeable
        renderRightActions={({ interpolate }) => (
          <View
            style={{ width: 70, height: 100, backgroundColor: "red" }}
          ></View>
        )}
      >
        <View style={styles.view}>
          <Text>Settings</Text>
        </View>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    backgroundColor: "green",
    width: Dimensions.get("screen").width,
    height: 100,
  },
});

export default Settings;
