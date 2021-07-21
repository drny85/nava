import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../config";
import moment from "moment";

import { LinearGradient } from "expo-linear-gradient";


const RecentOrderCard = ({ order, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ImageBackground
        style={styles.img}
        resizeMode="cover"
        source={{ uri: order.items[0]?.imageUrl }}
      >
        <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>

          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{
              textTransform: "capitalize",
              fontFamily: 'lobster',
              fontSize: 16,
              color: COLORS.white,
              marginTop: 8,
            }}
          >
            {order.restaurant.name}
          </Text>
          <Text numberOfLines={1}
            ellipsizeMode='tail' style={{
              ...FONTS.body4,
              color: COLORS.white
            }}>
            {order.items[0].name}
          </Text>

          <Text style={{ color: COLORS.white, fontSize: 12, marginBottom: 8, }}>
            {moment(order.orderPlaced).fromNow()}
          </Text>


        </LinearGradient>

      </ImageBackground>
    </TouchableOpacity>
  );
};

export default RecentOrderCard;

const styles = StyleSheet.create({
  container: {
    width: SIZES.width * 0.4,
    borderRadius: 15,
    elevation: 7,
    shadowColor: COLORS.lightGray,
    shadowRadius: 4,
    shadowOpacity: 0.7,
    shadowOffset: {
      width: 5,
      height: 8,
    },
    marginHorizontal: SIZES.padding * 0.2,

    overflow: 'hidden',
    height: SIZES.height * 0.10

  },
  img: {
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    width: '100%',
    overflow: 'hidden',

  },

});
