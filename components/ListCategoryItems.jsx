import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Card from "./Card";

const ListCategoryItems = ({ categories, items, onRefresh, refreshing }) => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<FlatList
				data={categories}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					return (
						<View>
							<FlatList
								ListHeaderComponent={(props) => (
									<Text style={styles.text}>{item.name}</Text>
								)}
								data={items.filter((i) => i.category === item.id)}
								keyExtractor={(item) => item.id}
								onRefresh={onRefresh}
								refreshing={refreshing}
								renderItem={({ item }) => {
									return (
										<Card
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
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		fontSize: 26,
		fontWeight: "700",
		textTransform: "capitalize",
		marginLeft: 12,
	},
});

export default ListCategoryItems;
