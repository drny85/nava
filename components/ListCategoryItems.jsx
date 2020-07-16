import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Card from "./Card";

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
						<View>
							<FlatList
								ListHeaderComponent={(props) => (
									<Text style={styles.text}>{item.name}</Text>
								)}
								data={items.filter((i) => i.category === item.id)}
								keyExtractor={(item) => item.id}
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
		fontSize: 30,
		fontWeight: "800",
		textTransform: "capitalize",
		marginLeft: 12,
		color: 'gray'
	},
});

export default ListCategoryItems;
