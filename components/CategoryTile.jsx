import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import constants from "../config/constants";
import colors from "../config/colors";

const { width } = Dimensions.get("screen");

const CategoryTile = ({ name, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: constants.categoriTileHeigth,
    width: width * 0.4,
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});

export default CategoryTile;
