import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { COLORS } from "../config";

export default function FloatingButton({ iconName, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Feather name={iconName} size={24} color={COLORS.black} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: COLORS.tile,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#34495e",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.7,
  },
});
