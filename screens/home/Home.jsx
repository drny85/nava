// @ts-nocheck
import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

import Screen from "../../components/Screen";
import Loader from "../../components/Loader";
import ItemsContext from "../../context/items/itemsContext";
import CategoryContext from "../../context/category/categoryContext";

import ListCategoryItems from "../../components/ListCategoryItems";

const Home = () => {
  const itemsContext = useContext(ItemsContext);
  const categoryContext = useContext(CategoryContext);

  const { items, getItems, loading, unsubcribeFromItems } = itemsContext;
  const { categories, getCategories } = categoryContext;

  useEffect(() => {
    console.log("getting items");
    getItems();
    getCategories();

    return () => {
      unsubcribeFromItems();
    };
  }, []);

  if (items.length === 0 || loading) {
    return <Loader size="large" />;
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>What are you craving for today?</Text>
      </View>

      <ListCategoryItems
        categories={categories}
        items={items}
        onRefresh={getItems}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    fontStyle: "italic",
    fontFamily: "montserrat-bold-italic",
  },
  headerView: {
    padding: 10,
  },
});

export default Home;
