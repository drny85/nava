import React, { useContext, useState } from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import Screen from "../../components/Screen";
import StoreCard from "../../components/StoreCard";
import authContext from "../../context/auth/authContext";
import storesContext from "../../context/stores/storesContext";

const MyFavorites = ({ navigation }) => {
  const { stores } = useContext(storesContext);
  const { user } = useContext(authContext);
  //const [favorites, setFavorites] = useState([])
  const favorites = [];

  stores.forEach((s) => {
    user?.favoriteStores.forEach((u) => {
      if (s.id === u) {
        favorites.push(s);
      }
    });
  });

  return (
    <Screen style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoreCard
              store={item}
              onPress={() => navigation.navigate("Home", { restaurant: item })}
            />
          )}
        />
      ) : (
          <View>
            <Text>No Favorite Stores.</Text>
          </View>
        )}
    </Screen>
  );
};

export default MyFavorites;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
