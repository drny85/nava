import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import colors from "../config/colors";
import { COLORS, SIZES } from "../config";
import { FontAwesome, Feather } from "@expo/vector-icons";
import authContext from "../context/auth/authContext";

const StoreCard = ({ store, onPress }) => {
  const { name, phone, street, city, zipcode, imageUrl } = store;
  const { user } = useContext(authContext);
  const isFavorite = user?.favoriteStores.find((s) => s === store.id);

  return (
    <TouchableOpacity style={styles.view} onPress={onPress}>
      <Image
        resizeMode="cover"
        style={styles.img}
        source={{
          uri: imageUrl
            ? imageUrl
            : "https://mk0tarestaurant7omoy.kinstacdn.com/wp-content/uploads/2018/01/premiumforrestaurants_0.jpg",
        }}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "black"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.details}
      ></LinearGradient>
      {isFavorite && (
        <View style={{ position: "absolute", top: 10, right: 15 }}>
          <Feather name="heart" size={32} color="red" />
        </View>
      )}
      <View style={styles.details2}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text style={styles.phone}>{phone}</Text>
        <Text style={styles.phone}>{street}</Text>
        <Text style={styles.caption}>
          {city}, {zipcode}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              color: "red",
              paddingLeft: 15,
              paddingVertical: 5,
              fontWeight: "700",
            }}
          >
            {store.open ? null : "CLOSED"}
          </Text>
          {store.estimatedDeliveryTime && (
            <Text
              style={{
                fontSize: 18,
                color: COLORS.white,
                textAlign: "right",
                paddingRight: 20,
                fontWeight: "500",
              }}
            >
              {store.estimatedDeliveryTime} mins
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreCard;

const styles = StyleSheet.create({
  view: {
    width: SIZES.width * 0.9,
    height: SIZES.height * 0.25,

    borderRadius: 15,
    elevation: 10,
    shadowColor: "red",
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    backgroundColor: colors.white,
    marginVertical: 8,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  details: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SIZES.height * 0.12,
    opacity: 0.5,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: "hidden",
  },
  details2: {
    position: "absolute",

    bottom: 0,
    width: "100%",
    height: SIZES.height * 0.12,
    paddingTop: 8,

    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: "hidden",
  },
  name: {
    fontSize: 16,
    fontFamily: "montserrat-bold",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    paddingLeft: 12,
    color: colors.tile,
  },
  caption: {
    paddingLeft: 12,
    textTransform: "capitalize",
    color: colors.tile,
    fontSize: 14,
  },
  phone: {
    paddingLeft: 12,
    textTransform: "capitalize",
    color: colors.tile,
    fontSize: 12,
  },
});
