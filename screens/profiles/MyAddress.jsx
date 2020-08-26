// @ts-nocheck
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Modal } from "react-native";
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import colors from "../../config/colors";
import AddressTile from "../../components/AddressTile";

const MyAddress = () => {
	const [address, setAddres] = useState(null);
	const [visible, setVisible] = useState(false);
	const [addresses, setAddresses] = useState([
		{
			id: "sdsdsdnwhw",
			address: "125 Marcy Place, Apt 53a",
			city: "Bronx",
			zipcode: "10452",
		},
		{
			id: "sdsrrttdnwhw",
			address: "1450 Clay Ave, Apt 1D",
			city: "Bronx",
			zipcode: "10456",
		},
	]);

	const setPreferred = () => {
		console.log("Pres");
	};

	return (
		<Screen style={styles.container}>
			<AppButton
				style={styles.btn}
				textStyle={{ color: colors.primary, fontSize: 15 }}
				title="Add New Address"
				onPress={() => setVisible(true)}
			/>
			{addresses.length === 0 ? (
				<View
					style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
				>
					<Text style={{ fontSize: 16 }}>No Preferred Address</Text>
				</View>
			) : (
				<View style={styles.mainView}>
					<FlatList
						data={addresses}
						key={({ item }) => item.id}
						renderItem={({ item }) => (
							<AddressTile address={item} setPreferred={setPreferred} />
						)}
					/>
				</View>
			)}

			<Modal
				visible={visible}
				presentationStyle="pageSheet"
				animationType="slide"
			>
				<View>
					<Text>Modal</Text>
					<AppButton title="Close" onPress={() => setVisible(false)} />
				</View>
			</Modal>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},

	btn: {
		width: "80%",
		marginVertical: 10,
		backgroundColor: "transparent",
		color: colors.primary,
		borderWidth: 1,
		borderColor: colors.primary,
	},
	mainView: {
		flex: 1,
	},
});

export default MyAddress;
