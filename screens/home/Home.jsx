// @ts-nocheck
import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";


import Screen from "../../components/Screen";
import Loader from "../../components/Loader";
import ItemsContext from "../../context/items/itemsContext";
import CategoryContext from "../../context/category/categoryContext";

import call from 'react-native-phone-call';

import ListCategoryItems from "../../components/ListCategoryItems";
import FloatingButton from "../../components/FloatingButton";
import RestaurantInfo from "../../components/RestaurantInfo";



const Home = ({ route }) => {
  const itemsContext = useContext(ItemsContext);
  const categoryContext = useContext(CategoryContext);
  const [visible, setVisible] = useState(false)

  const { items, getItems, loading } = itemsContext;
  const { categories, getCategories } = categoryContext;
  const { restaurant } = route.params;
  console.log(route)

  const makeCall = async () => {
    try {
      await call({ number: restaurant.phone, prompt: false })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    const { res, uns } = getItems(restaurant?.id)
    getCategories();

    return () => {

      uns && uns()
    };
  }, []);

  if (loading) {
    return <Loader size="large" />;
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.top}>
        <FloatingButton iconName='info' onPress={() => setVisible(true)} />
        <Text style={styles.name}>{restaurant.name}</Text>
        <FloatingButton iconName='phone' onPress={makeCall} />

      </View>
      <Modal visible={visible} animationType='slide'>
        <RestaurantInfo restaurant={restaurant} onPress={() => setVisible(false)} />
      </Modal>
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

  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    fontStyle: "italic",
    fontFamily: "montserrat-bold-italic",
  },
  headerView: {
    padding: 10,
  },
  name: {
    fontSize: 22,
    fontFamily: "montserrat",
    textTransform: 'capitalize',
  },

  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginHorizontal: 20, },
});

export default Home;
