// @ts-nocheck
import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	FlatList,
	ActivityIndicator,
} from "react-native";

import Card from "../components/Card";

import Screen from "../components/Screen";
import Loader from "../components/Loader";
import ItemsContext from "../context/items/itemsContext";
import CategoryContext from "../context/category/categoryContext";
import CategoryTile from "../components/CategoryTile";

import ListCategoryItems from "../components/ListCategoryItems";

const Home = ({ navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const itemsContext = useContext(ItemsContext);
	const categoryContext = useContext(CategoryContext);

	const {
		items,
		getItems,
		loading,
		filterItemsByCategory,
		filtered,
		clearItemsFilters,
	} = itemsContext;
	const { categories, getCategories } = categoryContext;

	useEffect(() => {
		getItems();
		getCategories();
	}, []);

	if (items.length === 0) {
		return <Loader />;
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
				isRefreshing={refreshing}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		marginTop: 20,
	},
	headerText: {
		fontSize: 26,
		fontWeight: "700",
		fontStyle: "italic",
	},
	headerView: {
		padding: 15,
	},
});

export default Home;
