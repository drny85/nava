// @ts-nocheck
import React, { useContext, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import Loader from "../../components/Loader";
import Screen from "../../components/Screen";
import StoreCard from "../../components/StoreCard";




import colors from "../../config/colors";

import storesContext from "../../context/stores/storesContext";



const Restaurants = ({ navigation, route }) => {
    const { stores, getStores, loading } = useContext(storesContext)
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchStores = (restaurant) => {

        navigation.navigate('Home', { restaurant })
    }

    useEffect(() => {
        getStores()
    }, [])


    if (loading) return <Loader />
    return (
        <Screen style={styles.screen}>
            <FlatList onRefresh={getStores}
                refreshing={refreshing} data={stores} keyExtractor={(item) => item.id} renderItem={({ item }) => {

                    return <StoreCard store={item} onPress={() => fetchStores(item)} />
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

export default Restaurants;
