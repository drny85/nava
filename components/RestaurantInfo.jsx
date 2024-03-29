import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,

  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import FloatingButton from "./FloatingButton";

import { Feather, FontAwesome } from "@expo/vector-icons";

import call from "react-native-phone-call";
import { COLORS, FONTS, SIZES } from "../config";
import authContext from "../context/auth/authContext";

const RestaurantInfo = ({ restaurant, onPress }) => {
  const [favorite, setFavorite] = useState(false);
  const { user, isFavorite } = useContext(authContext);
  const makeCall = async () => {
    try {
      await call({ number: restaurant.phone, prompt: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    const fav = await isFavorite(user.id, restaurant.id);
    setFavorite(fav);
  };

  useEffect(() => {
    const fav = user && user.favoriteStores.find((s) => s === restaurant.id);

    if (fav) {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
  }, [favorite, user]);

  return (
    <View style={styles.container}>
      <View style={styles.closeBtn}>
        <FloatingButton iconName="x" onPress={onPress} />
      </View>
      <Image
        resizeMode="cover"
        style={styles.img}
        source={{
          uri: restaurant.imageUrl ? restaurant.imageUrl :
            "https://img.texasmonthly.com/2020/04/restaurants-covid-19-coronavirus-not-reopening-salome-mcallen.jpg?auto=compress&crop=faces&fit=fit&fm=pjpg&ixlib=php-1.2.1&q=45&w=1100",
        }}
      />
      <Text
        style={[
          styles.name,
          { ...FONTS.h2, textTransform: "uppercase", letterSpacing: 1.1 },
        ]}
      >
        {restaurant.name}
      </Text>
      {user && (
        <View style={styles.fav}>
          {favorite ? (
            <FontAwesome
              onPress={handleFavorite}
              name="heart"
              size={40}
              color="red"
            />
          ) : (
              <Feather
                onPress={handleFavorite}
                name="heart"
                size={40}
                color="black"
              />
            )}
        </View>
      )}

      <View style={styles.details}>
        <View style={{ paddingBottom: 10, marginTop: 10 }}>
          <Text style={styles.text}>{restaurant.street}</Text>
          <Text style={styles.text}>
            {restaurant.city}, {restaurant.state} {restaurant.zipcode}
          </Text>
        </View>
        {restaurant.hours && (
          <View style={styles.hours}>
            <Text
              style={{
                ...FONTS.h3,
                textDecorationLine: "underline",

                textDecorationColor: COLORS.lightGray,
              }}
            >
              Business Hours
            </Text>
            <Text style={{ ...FONTS.body4 }}>
              Sunday: {restaurant.hours.sun}
            </Text>
            <Text style={{ ...FONTS.body4 }}>
              Monday: {restaurant.hours.mon}
            </Text>
            <Text style={{ ...FONTS.body4 }}>
              Tuesday: {restaurant.hours.tue}
            </Text>
            <Text style={{ ...FONTS.body4 }}>
              Wednesday: {restaurant.hours.wed}
            </Text>
            <Text style={{ ...FONTS.body4 }}>
              Thursday: {restaurant.hours.thu}
            </Text>
            <Text style={{ ...FONTS.body4 }}>
              Friday: {restaurant.hours.fri}
            </Text>
            <Text style={{ ...FONTS.body4 }}>
              Saturday: {restaurant.hours.sat}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={makeCall}>
          <Feather name="phone" size={24} color={COLORS.black} />
          <Text
            style={{ marginHorizontal: 8, ...FONTS.h4, color: COLORS.black }}
          >
            Call Restaurant
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RestaurantInfo;

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginVertical: 20,
    height: 50,
    borderColor: COLORS.black,
    borderWidth: 0.5,
    width: SIZES.width * 0.6,
    borderRadius: SIZES.radius * 2,
  },
  container: {
    flex: 1,
    zIndex: 1,
    justifyContent: "space-around",
    position: "relative",
  },
  closeBtn: {
    zIndex: 3,
    position: "absolute",
    right: 20,
    top: SIZES.statusBarHeight,
  },
  details: {
    backgroundColor: COLORS.tile,
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    position: "relative",
  },
  fav: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.tile,
    padding: 10,
  },
  hours: {
    padding: 10,
  },

  img: {
    width: SIZES.width,
    height: SIZES.height * 0.45,
  },
  name: {
    color: "white",
    position: "absolute",

    right: 10,
    top: SIZES.height * 0.45 - 50,
    textTransform: "capitalize",
  },
  text: {
    ...FONTS.body3,
    padding: 3,
    textTransform: "uppercase",
  },
});
