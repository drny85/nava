import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground } from "react-native";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { FONTS, SIZES, COLORS } from "../config";

const MostPouplarItem = ({ onPress, item }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ImageBackground style={styles.img} source={{ uri: item.imageUrl }}>
        <LinearGradient style={{ padding: 5, width: '100%', alignItems: 'center', justifyContent: 'center' }} start={{ x: 0.1, y: 0.5 }} end={{ x: 0, y: 0.8 }} colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}>
          <Text style={{ textTransform: "capitalize", fontFamily: 'lobster', fontWeight: '400', color: COLORS.white }}>
            {item.name}
          </Text>
        </LinearGradient>

      </ImageBackground>
    </TouchableOpacity>
  );
};

export default MostPouplarItem;

const styles = StyleSheet.create({
  container: {
    width: SIZES.width / 2.5,
    height: 50,
    borderRadius: 25,
    elevation: 5,
    shadowColor: COLORS.lightGray,
    shadowRadius: 4,
    overflow: 'hidden',

    shadowOpacity: 0.7,
    shadowOffset: {
      width: 5,
      height: 8,
    },
    marginHorizontal: SIZES.padding * 0.3,
  },
  img: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',


    opacity: 0.7,
  },

});
