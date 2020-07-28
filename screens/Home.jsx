// @ts-nocheck
import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

import Screen from "../components/Screen";
import Loader from "../components/Loader";
import ItemsContext from "../context/items/itemsContext";
import CategoryContext from "../context/category/categoryContext";

import ListCategoryItems from "../components/ListCategoryItems";

const Home = ({ navigation }) => {
	const itemsContext = useContext(ItemsContext);
	const categoryContext = useContext(CategoryContext);

	const { items, getItems, loading } = itemsContext;
	const { categories, getCategories } = categoryContext;

	useEffect(() => {
		getItems();
		getCategories();
	}, []);

	if (items.length === 0 || loading) {
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
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "700",
		fontStyle: "italic",
	},
	headerView: {
		padding: 15,
	},
});

export default Home;
