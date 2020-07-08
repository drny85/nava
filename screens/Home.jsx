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
import { db } from "../services/database";
import Loader from "../components/Loader";
import ItemsContext from "../context/items/itemsContext";
import CategoryContext from "../context/category/categoryContext";
import CategoryTile from "../components/CategoryTile";

const Home = ({ navigation }) => {
	// const [items, setItems] = useState([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const itemsContext = useContext(ItemsContext);
	const categoryContext = useContext(CategoryContext);
	const {
		items,
		getItems,
		loading,
		filterItemsByCategory,
		filtered,
		current,
	} = itemsContext;
	const { categories, getCategories } = categoryContext;

	useEffect(() => {
		getItems();
		getCategories();
	}, []);

	if (items.length === 0) {
		return <Loader />;
	}


	console.log('ITEMS',filtered)

	return (
		<Screen style={styles.screen}>
			<View style={styles.categoryView}>
				<FlatList
					horizontal
					data={categories}
					renderItem={({ item }) => {
						return (
							<CategoryTile
								name={item.name}
								onPress={() => filterItemsByCategory(item.name)}
							/>
						);
					}}
				/>
			</View>
			<FlatList
				onRefresh={() => getItems}
				refreshing={isRefreshing}
				data={items}
				renderItem={({ item }) => {
					return (
						<Card
							name={item.name}
							price={item.price}
							imageUrl={item.imageUrl}
							onPress={() =>
								navigation.navigate("ProductDetail", {
									item,
									routeName: "Details",
								})
							}
						/>
					);
				}}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	categoryView: {
		height: 80,
	},
});

export default Home;
