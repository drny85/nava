import React from "react";
import { StyleSheet, Text, FlatList, Dimensions } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Card from "./Card";
import itemsContext from "../context/items/itemsContext";
import colors from "../config/colors";

const ListCategoryItems = ({ categories, items, onRefresh }) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  return (
    <FlatList
      data={categories}
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <>
            {items.filter((i) => i.category === item.id).length !== 0 && (
              <Text style={styles.text}>
                {item.name} (
                {items.filter((i) => i.category === item.id).length})
              </Text>
            )}

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={items.filter((i) => i.category === item.id)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <Card
                    style={{ width: Dimensions.get("screen").width * 0.85 }}
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    sizes={item.sizes}
                    imageUrl={item.imageUrl}
                    onPress={() => {
                      navigation.navigate("ProductDetail", { product: item });
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
    width: "100%",
    // flexDirection: "row",
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "montserrat-bold",
    textTransform: "capitalize",
    marginLeft: 12,
    color: colors.text,
    textTransform: "uppercase",
    marginBottom: 10,
  },
});

export default ListCategoryItems;
