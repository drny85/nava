import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const AppInput = ({ icon, ...otherProps }) => {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          style={styles.icon}
          size={24}
          color={colors.ascent}
          name={icon}
        />
      )}
      <TextInput style={styles.input} {...otherProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",

    marginVertical: 12,
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    backgroundColor: colors.card,
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    color: "black",
    fontSize: 18,
    padding: 2,
  },
});

export default AppInput;
