import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Dimensions } from "react-native";
import colors from "../config/colors";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

const AddressTile = ({ address, onPress, renderRightActions }) => {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
          <View>
            <Text style={styles.text}>
              {address.street} {address.apt ? address.apt : null}
            </Text>
            <Text style={styles.text}>
              {address.city}, {address.zipcode}
            </Text>
          </View>
          {/* <View>
            {preferred && (
              <AntDesign
                style={{ paddingRight: 10 }}
                name="checkcircleo"
                size={24}
                color={colors.primary}
              />
            )}
          </View> */}
        </View>
      </TouchableWithoutFeedback>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.1,
    backgroundColor: colors.tile,
    flex: 1,
    padding: 10,
    borderTopColor: colors.secondary,
    borderBottomColor: colors.secondary,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    marginVertical: 5,
    fontSize: 16,
    fontFamily: "montserrat",
  },
});

export default AddressTile;
