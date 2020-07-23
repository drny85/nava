import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

const AppButton = ({ title, onPress, style, disable = true }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { opacity: disable ? 1 : 0.3 }, style]}
      disabled={!disable}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.ascent,
    borderRadius: 25,
    width: "100%",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 20,
  },
});

export default AppButton;
