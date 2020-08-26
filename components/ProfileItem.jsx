import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const ProfileItem = ({ text, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 16,
            textTransform: "capitalize",
            fontFamily: "montserrat",
          }}
        >
          {text}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",

    paddingHorizontal: 10,
    borderColor: colors.primary,
    borderBottomWidth: 0.3,
    borderTopWidth: 0.3,
    paddingVertical: 20,
  },
});

export default ProfileItem;
