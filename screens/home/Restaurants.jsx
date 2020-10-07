// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, FlatList, Text } from "react-native";

import Loader from "../../components/Loader";
import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";
import StoreCard from "../../components/StoreCard";
//import { useLocation } from '../../hooks/useLocation'

import storesContext from "../../context/stores/storesContext";


const Restaurants = ({ navigation }) => {
  const { stores, getStores, loading } = useContext(storesContext);

  const [refreshing, setRefreshing] = useState(false);
  const [text, setText] = useState('')

  // const { address, isloading } = useLocation()
  // console.log(address)

  const fetchStores = (restaurant) => {

    navigation.navigate("Home", { restaurant });
  };


  const onChange = e => {
    setText(e)
    console.log(storesCopy.map(s => s.name.includes(text)))
  }

  useEffect(() => {
    getStores();

    return () => { };
  }, []);

  console.log(loading)

  if (loading) return <Loader />;

  if (stores.length === 0) {
    return <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No Stores Listed</Text>
    </Screen>
  }
  return (
    <Screen style={styles.screen}>
      {/* <SearchBar text={text} onChange={e => onChange(e)} /> */}
      <FlatList
        onRefresh={getStores}
        refreshing={refreshing}
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {

          return <StoreCard store={item} onPress={() => fetchStores(item)} />;
        }}
      />
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

export default Restaurants;
