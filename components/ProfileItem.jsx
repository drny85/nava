import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../config";

const ProfileItem = ({ text, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Text
          style={{
            ...FONTS.body4,
            textTransform: 'capitalize'
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
    width: SIZES.width * 0.95,
    alignItems: "center",
    height: SIZES.height * 0.09,
    maxHeight: 80,
    marginHorizontal: 5,
    alignSelf: 'center',

    paddingHorizontal: 10,
    marginVertical: 5,
    shadowOffset: {
      width: 5, height: 7
    },
    elevation: 7,
    shadowColor: COLORS.secondary,
    backgroundColor: COLORS.primary,

    shadowOpacity: 0.7,
    shadowRadius: 8,

  },

});

export default ProfileItem;
