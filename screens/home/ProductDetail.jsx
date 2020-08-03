// @ts-nocheck
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import cartContext from "../../context/cart/cartContext";

const heigth = Dimensions.get("screen").height;

const ProductDetail = ({ route, navigation }) => {
  const { item } = route.params;
  const { addToCart, cartItems, totalCounts } = useContext(cartContext);

  const handleAddToCart = () => {
    addToCart(item);
    navigation.pop();
  };

  return (
    <View style={styles.screen}>
      <View>
        <Image style={styles.image} source={{ uri: item.imageUrl }} />
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
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonView}>
        <AppButton title="add to cart" onPress={handleAddToCart} />
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
  scrollView: {},
  screen: {
    flex: 1,
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: heigth * 0.5,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 20,
    zIndex: 1,
  },
  details: {
    padding: 12,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 28,
    textTransform: "capitalize",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
  },
});

export default ProductDetail;
