import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../config/colors";

const CardSummaryItem = ({ title, subtitle, misc }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View
        style={{
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Text style={styles.subtitle}>{subtitle}</Text>
        {misc && <Text style={styles.misc}>{misc}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 3,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    backgroundColor: colors.tile,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    paddingBottom: 5,
  },
  subtitle: {
    marginBottom: 5,
    fontSize: 16,
  },
  misc: {
    fontSize: 16,
  },
});

export default CardSummaryItem;
