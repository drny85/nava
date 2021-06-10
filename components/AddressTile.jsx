import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { COLORS, SIZES } from "../config";

const AddressTile = ({ address, onPress, renderRightActions }) => {
  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
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
    width: SIZES.width * 0.98,
    height: SIZES.height * 0.1,
    backgroundColor: COLORS.card,
    elevation: 8,
    shadowColor: COLORS.lightGray,
    shadowOffset: {
      width: 4, height: 6
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    borderRadius: 6,

    flex: 1,
    padding: 10,
    // borderTopColor: colors.secondary,
    // borderBottomColor: colors.secondary,
    // borderTopWidth: 1.5,
    // borderBottomWidth: 1.5,

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
