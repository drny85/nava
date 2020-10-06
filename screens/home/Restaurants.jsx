// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";

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
  console.log(text)

  const onChange = e => {
    setText(e)
    console.log(storesCopy.map(s => s.name.includes(text)))
  }

  useEffect(() => {
    getStores();

    return () => { };
  }, []);

  if (loading) return <Loader />;
  return (
    <Screen style={styles.screen}>
      <SearchBar text={text} onChange={e => onChange(e)} />
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
