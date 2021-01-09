import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../config/colors";
import { COLORS } from "../config";

export default function FloatingButton({ iconName, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Feather name={iconName} size={24} color={COLORS.black} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.tile,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#34495e",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.7,
  },
});
