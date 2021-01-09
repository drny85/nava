import React, { useContext } from "react";
import { StyleSheet, FlatList } from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import storesContext from "../../context/stores/storesContext";

const MyFavorites = () => {
  const { stores } = useContext(storesContext);
  const { user } = useContext(authContext);

  return <Screen></Screen>;
};

export default MyFavorites;

const styles = StyleSheet.create({});
