import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../config";
import moment from "moment";

const RecentOrderCard = ({ order, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.topView}>
        <Image
          style={styles.img}
          resizeMode="cover"
          source={{ uri: order.items[0]?.imageUrl }}
        />
      </View>

      <View style={styles.bottomView}>
        <Text
          style={{
            ...FONTS.body5,
            textTransform: "capitalize",

            color: COLORS.black,
          }}
        >
          {order.restaurant.name}
        </Text>

        <Text style={{ color: COLORS.black, fontSize: 10, opacity: 0.5 }}>
          {moment(order.orderPlaced).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecentOrderCard;

const styles = StyleSheet.create({
  container: {
    width: SIZES.width / 2.5,
    height: "100%",
    borderRadius: SIZES.radius * 2,
    elevation: 5,
    shadowColor: COLORS.lightGray,
    shadowRadius: 4,

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
  },
  bottomView: {
    height: "30%",
    width: "100%",
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    opacity: 0.8,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 5,
      height: 8,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 7,

    alignItems: "center",
    justifyContent: "center",
  },
  topView: {
    height: "70%",
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    backgroundColor: COLORS.card,
  },
});
