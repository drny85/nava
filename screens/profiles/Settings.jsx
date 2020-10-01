// @ts-nocheck
import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import Loader from "../../components/Loader";
import Screen from "../../components/Screen";
import StoreCard from "../../components/StoreCard";




import colors from "../../config/colors";
import itemsContext from "../../context/items/itemsContext";
import storesContext from "../../context/stores/storesContext";



const Settings = () => {
  const { stores, getStores, loading } = useContext(storesContext)
  const { getItems } = useContext(itemsContext)

  const fetchStores = async (id) => {
    try {

      const fetched = await getItems(id);
      console.log('F', fetched)


    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    getStores()
  }, [])



  if (loading) return <Loader />
  return (
    <Screen style={styles.screen}>
      <FlatList data={stores} keyExtractor={(item) => item.id} renderItem={({ item }) => {

        return <StoreCard store={item} onPress={() => fetchStores(item.id)} />
      }} />

    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

});

export default Settings;
