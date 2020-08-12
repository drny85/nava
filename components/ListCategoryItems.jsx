import React, { useContext } from "react";
import { View, StyleSheet, Text, FlatList, Dimensions } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Card from "./Card";
import itemsContext from "../context/items/itemsContext";

const ListCategoryItems = ({ categories, items, onRefresh }) => {
	const navigation = useNavigation();
	const [refreshing, setRefreshing] = React.useState(false);
	const { setCurrent } = useContext(itemsContext);

	return (
		<FlatList
			data={categories}
			onRefresh={onRefresh}
			refreshing={refreshing}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => {
				return (
					<>
						{items.filter((i) => i.category === item.id).length !== 0 && (
							<Text style={styles.text}>
								{item.name} (
								{items.filter((i) => i.category === item.id).length})
							</Text>
						)}

						<FlatList
							horizontal
							showsHorizontalScrollIndicator={false}
							data={items.filter((i) => i.category === item.id)}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => {
								return (
									<Card
										style={{ width: Dimensions.get("screen").width * 0.85 }}
										key={item.id}
										name={item.name}
										price={item.price}
										sizes={item.sizes}
										imageUrl={item.imageUrl}
										onPress={() => {
											navigation.navigate("ProductDetail", { id: item.id });
										}}
									/>
								);
							}}
						/>
					</>
				);
			}}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		// flexDirection: "row",
	},
	text: {
		fontSize: 30,
		fontWeight: "800",
		textTransform: "capitalize",
		marginLeft: 12,
		color: "gray",
		marginBottom: 10,
	},
});

export default ListCategoryItems;
