import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Animated } from "react-native";

import { COLORS, FONTS, SIZES } from "../config";
import { Feather } from "@expo/vector-icons";
import authContext from "../context/auth/authContext";

const StoreCard = ({ store, onPress, scale = null, opacity = null }) => {
  const { name, phone, street, city, zipcode, imageUrl } = store;
  const { user } = useContext(authContext);
  const isFavorite = user?.favoriteStores.find((s) => s === store.id);

  return (
    <Animated.View style={{ transform: scale && [{ scale }], opacity: opacity && opacity }}>
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
          <Text style={styles.phone}>{street},  {city}, {zipcode}</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-end', position: 'absolute', bottom: 10, left: 0, right: 0, paddingHorizontal: SIZES.padding * 0.5 }}>
            {!store.open && (<Text
              style={{
                color: "red",
                paddingLeft: 15,
                paddingVertical: 5,
                fontWeight: "700",
              }}
            >
              CLOSED
            </Text>)}

            {store.deliveryMinimum && store.open ? (<Text style={{ ...FONTS.body5, color: COLORS.white, fontFamily: 'montserrat-bold', }}>${store.deliveryMinimum} minimum delivery</Text>) : (<Text style={{ ...FONTS.body5, color: COLORS.white, fontFamily: 'montserrat-bold', }}>Free Delivery</Text>)}
            {store.estimatedDeliveryTime && (
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  textAlign: "right",
                  fontWeight: "500",
                }}
              >
                {store.estimatedDeliveryTime} mins
              </Text>
            )}
          </View>
        </View>
        <View
          style={[
            styles.details,
            {
              backgroundColor: "rgba(0,0,0,0.7)",
              zIndex: 1,
              borderRadius: 15,
            },
          ]}
        ></View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
    backgroundColor: COLORS.white,
    marginVertical: 8,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: COLORS.white,
  },
  details: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SIZES.height * 0.15,
    opacity: 0.5,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: "hidden",
  },
  details2: {
    position: "absolute",

    bottom: 0,
    width: "100%",
    height: SIZES.height * 0.15,
    paddingTop: 8,

    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: "hidden",
    zIndex: 2,
  },
  name: {
    fontSize: 22,
    fontFamily: "lobster",
    textTransform: 'capitalize',
    letterSpacing: 1.1,
    paddingLeft: 12,
    color: COLORS.tile,
  },
  caption: {
    paddingLeft: 12,
    textTransform: "capitalize",
    color: COLORS.tile,
    fontSize: 14,
  },
  phone: {
    paddingLeft: 12,
    textTransform: "capitalize",
    color: COLORS.tile,
    fontSize: 12,
    marginVertical: 2
  },
});

export default StoreCard;
