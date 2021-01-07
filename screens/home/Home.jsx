// @ts-nocheck
import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";

import Screen from "../../components/Screen";
import Loader from "../../components/Loader";
import ItemsContext from "../../context/items/itemsContext";
import CategoryContext from "../../context/category/categoryContext";

import call from "react-native-phone-call";

import ListCategoryItems from "../../components/ListCategoryItems";
import FloatingButton from "../../components/FloatingButton";
import RestaurantInfo from "../../components/RestaurantInfo";
import { COLORS, FONTS, SIZES } from "../../config";
import RecentOrderCard from "../../components/RecentOrderCard";
import MostPouplarItem from "../../components/MostPouplarItem";

const Home = ({ route, navigation }) => {
  const itemsContext = useContext(ItemsContext);
  const categoryContext = useContext(CategoryContext);
  const [visible, setVisible] = useState(false);
  const [mostPopular, setMostPopular] = useState([])

  const { items, getItems, loading } = itemsContext;
  const { categories, getCategories } = categoryContext;
  const { restaurant } = route.params;

  const makeCall = async () => {
    try {
      await call({ number: restaurant.phone, prompt: false });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMostPopular = () => {
    const itemsCopy = [...items]
    const popular = itemsCopy.sort((a, b) => a.unitSold < b.unitSold).slice(0, 7)
    setMostPopular(popular)
  }

  useEffect(() => {
    const { res, uns } = getItems(restaurant?.id);
    getCategories(restaurant?.id);
    fetchMostPopular()

    return () => {
      uns && uns();
    };
  }, []);

  if (loading) {
    return <Loader size="large" />;
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.top}>
        <FloatingButton iconName="arrow-left" onPress={() => navigation.navigate('Restaurants')} />
        <Text style={styles.name}>{restaurant.name}</Text>
        <FloatingButton iconName="phone" onPress={() => setVisible(true)} />
      </View>
      <Modal visible={visible} animationType="slide">
        <RestaurantInfo
          restaurant={restaurant}
          onPress={() => setVisible(false)}
        />
      </Modal>
      <View style={styles.headerView}>
        <Text style={{ ...FONTS.body2, paddingLeft: 10 }}>What are you craving for today?</Text>
      </View>
      {mostPopular.length > 0 && (
        <View style={{ justifyContent: 'flex-start', width: SIZES.width, height: SIZES.height * 0.20, padding: SIZES.radius }}>
          <Text style={{ paddingLeft: 12, paddingBottom: 5, ...FONTS.body2 }}>Most Popular</Text>

          <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={{ height: '100%' }} data={mostPopular} horizontal keyExtractor={item => item.id} renderItem={({ item }) => <MostPouplarItem item={item} onPress={() => navigation.navigate('ProductDetail', { product: item, restaurant })} />} />
        </View>
      )}


      <ListCategoryItems
        categories={categories}
        items={items}
        restaurant={restaurant}
        onRefresh={getItems}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    textTransform: "capitalize",
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 20,
  },
});

export default Home;
