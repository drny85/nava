import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Card from "./Card";
import { ScrollView } from "react-native-gesture-handler";

const ListCategoryItems = ({ categories, items, onRefresh }) => {
	const navigation = useNavigation();
	const [refreshing, setRefreshing] = React.useState(false);

	return (
		<View style={styles.container}>
			<FlatList
				data={categories}
				onRefresh={onRefresh}
				refreshing={refreshing}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					return (
						<>
							<Text style={styles.text}>{item.name}</Text>
							<View style={{ flex: 1, width: "100%", flexDirection: "row" }}>
								<FlatList
									data={items.filter((i) => i.category === item.id)}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => {
										return (
											<Card
												style={{}}
												key={item.id}
												name={item.name}
												price={item.price}
												imageUrl={item.imageUrl}
												onPress={() =>
													navigation.navigate("ProductDetail", {
														item,
													})
												}
											/>
										);
									}}
								/>
							</View>
						</>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
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
