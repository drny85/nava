// @ts-nocheck
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Modal,
	KeyboardAvoidingView,
	ScrollView,
} from "react-native";
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import colors from "../../config/colors";
import AddressTile from "../../components/AddressTile";
import { Ionicons } from "@expo/vector-icons";
import AppForm from "../../components/AppForm";

import * as Yup from "yup";
import AppFormField from "../../components/AppFormField";
import AppSubmitButton from "../../components/AppSubmitButton";
import { useContext } from "react";
import authContext from "../../context/auth/authContext";
import { useEffect } from "react";
import { Alert } from "react-native";

const addressSchema = Yup.object().shape({
	street: Yup.string().required().label("Street"),
	apt: Yup.string(),
	city: Yup.string().required().label("City"),
	zipcode: Yup.string().required().min(5).label("Zip code"),
});

const MyAddress = ({ navigation, route }) => {
	const { user, saveDeliveryAddress } = useContext(authContext);
	const [address, setAddres] = useState(null);
	const [visible, setVisible] = useState(false);
	const [addresses, setAddresses] = useState([]);
	const { deliveryAddresses } = user;

	const { previous } = route.params;

	const handleAddressPress = (item) => {
		navigation.navigate("Checkout", { previous: item });
	};

	const addNewAddress = async (address) => {
		try {
			address.userId = user.id;
			const result = await saveDeliveryAddress(address);
			if (result.message === true) {
				navigation.pop();
			} else {
				Alert.alert("Sorry", `${result.message}`, [
					{ text: "OK", style: "default" },
				]);
			}
		} catch (error) {
			console.log("Error addNewAddress", error);
		}
	};

	useEffect(() => {
		if (deliveryAddresses) setAddresses(deliveryAddresses);
	}, [user]);

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
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<AddressTile
								address={item}
								onPress={() => (previous ? handleAddressPress(item) : null)}
							/>
						)}
					/>
				</View>
			)}

			<Modal
				visible={visible}
				presentationStyle="overFullScreen"
				animationType="slide"
				onDismiss={() => setVisible(false)}
				onRequestClose={() => console.log("closing")}
			>
				<ScrollView>
					<Screen style={styles.viewModal}>
						<Ionicons
							onPress={() => setVisible(false)}
							style={styles.modalClose}
							name="ios-close"
							allowFontScaling={true}
							size={38}
							color="black"
						/>
						<View style={styles.modalForm}>
							<Text
								style={{
									textAlign: "center",
									fontFamily: "montserrat-bold",
									fontSize: 20,
									marginBottom: 20,
								}}
							>
								Delivery Address
							</Text>
							<AppForm
								initialValues={{ street: "", apt: "", city: "", zipcode: "" }}
								validationSchema={addressSchema}
								onSubmit={addNewAddress}
							>
								<AppFormField
									name="street"
									placeholder="Street number and name"
								/>
								<AppFormField name="apt" placeholder="Apt, Suite, Floor" />
								<AppFormField name="city" placeholder="City" />
								<AppFormField
									name="zipcode"
									placeholder="Zip Code, Postal Code"
								/>

								<AppSubmitButton
									style={{ backgroundColor: colors.primary, marginTop: 20 }}
									title="Save Address"
								/>
							</AppForm>
						</View>
					</Screen>
				</ScrollView>
			</Modal>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		position: "relative",
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

	viewModal: {
		flex: 1,
		alignItems: "center",
		position: "relative",
		justifyContent: "center",
	},

	modalClose: {
		position: "absolute",
		left: 10,
		top: 20,
		padding: 10,
	},
	modalForm: {
		padding: 10,
		width: "100%",
		marginTop: 100,
	},
});

export default MyAddress;
