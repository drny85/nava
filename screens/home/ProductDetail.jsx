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
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import cartContext from "../../context/cart/cartContext";
import { Alert } from "react-native";

import Loader from "../../components/Loader";
import storesContext from "../../context/stores/storesContext";
import Divider from "../../components/Divider";

const heigth = Dimensions.get("screen").height;

const ProductDetail = ({ route, navigation }) => {
  const sizes = [];
  const { product, restaurant } = route.params;
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
    clearCart();
    item.size = checked ? checked : null;
    item.price =
      item.size === null
        ? parseFloat(item.price)
        : parseFloat(item.price[checked]);
    item.instruction = instruction;


    await addToCart(item)
    navigation.goBack()
  }

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
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      >
        <View>
          <Image style={styles.image} source={{ uri: item && item.imageUrl }} />
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
          <ScrollView style={styles.scrollView}>
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              {/* <Text style={styles.price}>${item.sizes ? item.price[checked] : item.price}</Text> */}
              <Text style={styles.price}>
                {item.sizes && checked ? `$${item.price[checked]}` : null}
                {item.sizes && !checked
                  ? `$${item.price[item.sizes[0]]} - $${item.price[item.sizes[item.sizes.length - 1]]
                  }`
                  : null}
                {!item.sizes && `$${item.price}`}
              </Text>
            </View>
            <View style={styles.descriptionView}>
              <Text
                style={{ color: "grey", fontSize: 16, fontStyle: "italic" }}
              >
                -- {item.description}
              </Text>
            </View>
            <Divider />
            {item.sizes && item.sizes.length > 0 && (
              <View style={{ marginVertical: 10 }}>
                <Text
                  style={{ paddingLeft: 10, fontSize: 16, fontWeight: "600" }}
                >
                  Pick a size
                </Text>
                <View
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
                        checkedColor={colors.primary}
                        containerStyle={{ backgroundColor: colors.tile }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        title={size}
                        onPress={() => handleCheck(size)}
                        checked={checked === size}
                      />
                    );
                  })}
                </View>
              </View>
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
                placeholderTextColor={"grey"}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.buttonView}>
        <AppButton
          style={{ backgroundColor: colors.primary }}
          title="add to cart"
          onPress={handleAddToCart}
        />
      </View>
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
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1.1,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    backgroundColor: colors.secondary,

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
    fontFamily: 'montserrat',
  },
  instruction: {
    backgroundColor: colors.secondary,
    height: 80,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
  },

  screen: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.tile,
    height: Dimensions.get('screen').height,
  },
  image: {
    width: "100%",
    height: heigth * 0.4,
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
    fontSize: 24,
    textTransform: "capitalize",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
});

export default ProductDetail;
