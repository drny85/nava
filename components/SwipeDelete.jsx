import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SwipeDelete({ onPress }) {
  return (
    <View style={styles.view}>
      <MaterialCommunityIcons
        onPress={onPress}
        name="trash-can-outline"
        size={30}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    width: 70,
    height: "100%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});
