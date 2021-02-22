import React, { useContext } from "react";
import { StyleSheet, Text, FlatList, Dimensions } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Card from "./Card";

import colors from "../config/colors";
import { FONTS, SIZES } from "../config";

const ListCategoryItems = ({ categories, items, restaurant }) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={categories.sort((a, b) => a.name < b.name ? -1 : 1)} ß
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <>
            {items.filter((i) => i.category === item.id).length !== 0 && (
              <Text style={[styles.text, { ...FONTS.body2 }]}>
                {item.name} (
                {items.filter((i) => i.category === item.id).length})
              </Text>
            )}

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={items.filter((i) => i.category === item.id)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <Card
                    style={{
                      width: Dimensions.get("screen").width * 0.85,
                      maxWidth: 600,
                    }}
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    sizes={item.sizes}
                    imageUrl={item.imageUrl}
                    onPress={() => {
                      navigation.navigate("ProductDetail", {
                        product: item,
                        restaurant,
                      });
                    }}
                  />
                );
              }}
            />
          </>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZES.width,
    maxWidth: 600,

    // flexDirection: "row",
  },
  text: {
    textTransform: "capitalize",
    marginLeft: 12,
    color: colors.text,
  },
});

export default ListCategoryItems;
