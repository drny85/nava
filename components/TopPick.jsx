import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Screen } from "react-native-screens";
import Card from "./Card";

const TopPick = () => {
	const DATA = [
		{
			id: 1,
			title: "Orange Juice",
			subTitle: "9.99",
			image: "https://images.unsplash.com/photo-1528198622811-0842b4e50787?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		},
		{
			id: 2,
			title: "Orange Juice",
			subTitle: "9.99",
			image: "https://images.unsplash.com/photo-1528198622811-0842b4e50787?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		},
		{
			id: 3,
			title: "Orange Juice",
			subTitle: "9.99",
			image: "https://images.unsplash.com/photo-1528198622811-0842b4e50787?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		},
		{
			id: 4,
			title: "Orange Juice",
			subTitle: "7.99",
			image: "https://images.unsplash.com/photo-1528198622811-0842b4e50787?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
		},
	];
	return (
		<View style={styles.container}>
			<FlatList
				data={DATA}
				renderItem={({ item }) => (
					<Card
						title={item.title}
						subTitle={item.subTitle}
						image={item.image}
						onPress={() => {}}
					/>
				)}
				keyExtractor={({ item }) => item}
				horizontal
			/>
            
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		height: 300,
	},
});

export default TopPick;
