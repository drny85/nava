import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const AppInput = ({ iconName, focus = false, style, ...otherProps }) => {
  return (
    <View style={styles.container}>
      {iconName && (
        <MaterialCommunityIcons
          style={styles.icon}
          size={24}
          color={colors.ascent}
          name={iconName}
        />
      )}
      <TextInput
        autoFocus={focus}
        style={[styles.input, style]}
        {...otherProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,

    marginVertical: 12,
    padding: 8,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: colors.tile,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    color: "black",
    fontSize: 20,
    padding: 5,
    height: "100%",
  },
});

export default AppInput;
