// @ts-nocheck
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import AppButton from "../../components/AppButton";
import cartContext from "../../context/cart/cartContext";
import { Alert } from "react-native";

import * as Animatable from 'react-native-animatable';
import { SharedElement } from 'react-navigation-shared-element';


import Loader from "../../components/Loader";
import storesContext from "../../context/stores/storesContext";
import Divider from "../../components/Divider";
import { COLORS, FONTS, SIZES } from "../../config";

const heigth = Dimensions.get("screen").height;
const fadeIn = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};

const ProductDetail = ({ route, navigation }) => {
  const sizes = [];
  const { product, restaurant, deliveryType } = route.params;
  const [instruction, setIntruction] = useState(null);

  const { addToCart, cartItems, clearCart } = useContext(cartContext);
  const [checked, setChecked] = useState(false);
  const item = { ...product };

  const priceRange = () => {
    if (item.sizes) {
      const index = item.sizes.length;
      const last = item.price[item.sizes[index - 1]];
      const first = item.price[item.sizes[0]];
      return `${first} - $${last}`;
    } else {
      return item.price;
    }
  };

  const handleCheck = (item) => {
    //add size to the array just once;
    const found = sizes.find((i) => i === item);
    if (found) return;
    const index = sizes.findIndex((i) => i === item);
    sizes.splice(index, 1);

    sizes.push(item);
    setChecked(item);
  };

  const clearCartAndAddNew = async () => {
    if (checked === false && item.sizes) {
      Alert.alert("Size Matter", `Please pick a size for your ${item.name}`, [
        { text: "OK", style: "cancel" },
      ]);
      return;
    }
    const cleared = clearCart();
    if (cleared) {
      item.size = checked ? checked : null;
      item.price =
        item.size === null
          ? parseFloat(item.price)
          : parseFloat(item.price[checked]);
      item.instruction = instruction;

      await addToCart(item);
      navigation.goBack();
    } else {
      console.log("error deleting and adding to cart");
    }
  };

  const handleAddToCart = async () => {
    //check if the item being added is from the same store.
    const { storeId } = item;
    const items = [...cartItems];
    const notEmpty = items.length > 0;

    if (notEmpty) {
      const found = items.find((i) => i.storeId === storeId);
      if (!found) {
        Alert.alert(
          "Different Store",
          `You already have an item in the cart from a different restaurant`,
          [
            { text: "Empty & Add", onPress: clearCartAndAddNew },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      } else {
        if (checked === false && item.sizes) {
          Alert.alert(
            "Size Matter",
            `Please pick a size for your ${item.name}`,
            [{ text: "OK", style: "cancel" }]
          );
          return;
        }

        item.size = checked ? checked : null;
        item.price =
          item.size === null
            ? parseFloat(item.price)
            : parseFloat(item.price[checked]);
        item.instruction = instruction;

        await addToCart(item);
        navigation.pop();
      }

      return;
    } else {
      if (checked === false && item.sizes) {
        Alert.alert("Size Matter", `Please pick a size for your ${item.name}`, [
          { text: "OK", style: "cancel" },
        ]);
        return;
      }

      item.size = checked ? checked : null;
      item.price =
        item.size === null
          ? parseFloat(item.price)
          : parseFloat(item.price[checked]);
      item.instruction = instruction;

      await addToCart(item);
      navigation.pop();
    }
  };

  useEffect(() => {
    return () => {
      //setChecked(false);
    };
  }, []);

  if (!item) return <Loader />;

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "space-between" }}
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      >

        <Animatable.View style={styles.imgView} animation='fadeIn'>
          <SharedElement id={`image.${item.imageUrl}.item`} >
            <Image style={styles.image} source={{ uri: item && item.imageUrl }} />
          </SharedElement>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View style={styles.back}>
              <Feather
                name="x"
                style={{ fontWeight: "700" }}
                size={24}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        </Animatable.View>

        <ScrollView
          contentContainerStyle={{ paddingVertical: 10 }}
          style={styles.scrollView}
        >
          <View style={styles.details}>
            <SharedElement id={`item.${item.name}.name`}>
              <Text style={styles.name}>{item.name}</Text>
            </SharedElement>
            {/* <Text style={styles.price}>${item.sizes ? item.price[checked] : item.price}</Text> */}
            <SharedElement id={`item.${item.price || item.price[item.sizes[0]]}.price`}>
              <Text style={styles.price}>
                {item.sizes && checked ? `$${item.price[checked]}` : null}
                {item.sizes && !checked
                  ? `$${item.price[item.sizes[0]]} - $${item.price[item.sizes[item.sizes.length - 1]]
                  }`
                  : null}
                {!item.sizes && `$${item.price}`}
              </Text>
            </SharedElement>
          </View>
          <View style={styles.descriptionView}>
            <Text style={{ color: "grey", fontSize: 16, fontStyle: "italic" }}>
              -- {item.description}
            </Text>
          </View>
          <Divider />
          {item.sizes && item.sizes.length > 0 && (
            <Animatable.View style={{ marginVertical: 10 }}>
              <Animatable.Text
                animation={fadeIn}
                duration={SIZES.padding * 100}

                style={{ paddingLeft: 10, fontSize: 16, fontWeight: "600" }}
              >
                Pick a size
              </Animatable.Text>
              <Animatable.View
                animation='fadeIn'
                delay={SIZES.padding * 4}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                {item.sizes.map((size, i) => {
                  return (
                    <CheckBox
                      key={i}
                      center
                      textStyle={{ textTransform: "capitalize" }}
                      checkedColor={COLORS.secondary}
                      containerStyle={{ backgroundColor: COLORS.primary }}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      title={size}
                      onPress={() => handleCheck(size)}
                      checked={checked === size}
                    />
                  );
                })}
              </Animatable.View>
            </Animatable.View>
          )}

          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, paddingLeft: 5, paddingBottom: 5 }}>
              Special instructions
            </Text>
            <TextInput
              style={styles.instruction}
              multiline
              value={instruction}
              onChangeText={(text) => setIntruction(text)}
              numberOfLines={3}
              placeholder="Dressing on the side? any request on this item, please let us know here."
              placeholderTextColor={COLORS.ascent}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonView}>
          <AppButton

            title="add to cart"
            onPress={handleAddToCart}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 50,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 50,
    zIndex: 3,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1.1,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,

    marginRight: 20,
    borderRadius: 30,
  },
  descriptionView: {
    // backgroundColor: colors.secondary,
    height: "auto",
    maxHeight: 80,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    fontFamily: "montserrat",
  },
  imgView: {
    height: "40%",
    marginBottom: 5,
  },
  instruction: {
    backgroundColor: COLORS.card,
    height: 80,
    padding: 10,
    fontSize: 12,
    borderRadius: SIZES.padding * 0.3,
  },
  scrollView: {
    // height: '100%'
    height: "50%",
  },

  screen: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: COLORS.tile,
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 20,
    zIndex: 1,
  },
  details: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  name: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 1.1,
    textTransform: "capitalize",
    fontFamily: 'lobster',
    lineHeight: 28,
    color: "black",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
});

ProductDetail.sharedElements = (route, otherRoute, showing) => {
  const { product } = route.params;

  return [
    { id: `image.${product.imageUrl}.item` },
    { id: `item.${product.name}.name` },
    {
      id: `item.${product.price || product.price[product.sizes[0]]}.price`
    }
  ]
}

export default ProductDetail;
