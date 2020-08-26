// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AppButton from "../../components/AppButton";

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
      <Text>Settings</Text>
      <AppButton title="Press Me" onPress={showNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Settings;
