import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import colors from "../config/colors";

const Pick = ({ onPress, width = "50%", title, type, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: "100%",
        backgroundColor: type === title ? colors.primary : colors.tile,
        width: width,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <View>
        <Text style={[styles.option, style]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});

export default Pick;
