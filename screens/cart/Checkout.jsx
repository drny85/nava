// @ts-nocheck
import React, { useContext, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
	Alert,
} from "react-native";

import cartContext from "../../context/cart/cartContext";
import colors from "../../config/colors";
import authContext from "../../context/auth/authContext";
import settingsContext from "../../context/settings/settingsContext";
import Pick from "../../components/Pick";

import AppForm from "../../components/AppForm";
import AppFormField from "../../components/AppFormField";

import * as Yup from "yup";
import AppSubmitButton from "../../components/AppSubmitButton";
import Screen from "../../components/Screen";

const pickUpSchema = Yup.object().shape({
	name: Yup.string().required().label("First Name"),
	lastName: Yup.string().required().label("Last Name"),
	phone: Yup.string().required().min(10).label("Phone"),
	email: Yup.string().email().required().label("Email"),
});

const deliverySchema = Yup.object().shape({
	name: Yup.string().required().label("First Name"),
	lastName: Yup.string().required().label("Last Name"),
	phone: Yup.string().required().min(10).label("Phone"),
	address: Yup.string().required().label("Address"),
	apt: Yup.string().label("Apt or Floor"),
	city: Yup.string().required().label("City"),
	zipcode: Yup.string().required().min(5).label("Zip code"),
	email: Yup.string().email().required().label("Email"),
});

const Checkout = ({ route, navigation }) => {
	const { user } = useContext(authContext);
	const [paymentOption, setPaymentOption] = useState("credit");
	const { setRoute, setDeliveryMethod, deliveryMethod } = useContext(
		settingsContext
	);

	const [deliveryOption, setDeliveryOption] = useState(deliveryMethod);

	const { clearCart, cartItems, cartTotal, itemCounts } = useContext(
		cartContext
	);

	const handlePickup = (pickupInfo) => {
		if (paymentOption === "cash") {
			Alert.alert("Payment", "Please select a payment method", [
				{ text: "OK", style: "cancel" },
			]);
			return;
		}

		navigation.navigate("Orders", {
			screen: "OrderSummary",
			params: {
				deliveryMethod: deliveryOption,
				paymentMethod: paymentOption,
				customer: pickupInfo,
			},
		});
	};

	const handleDelivery = (deliveryInfo) => {
		if (paymentOption === "in store" || paymentOption === "") {
			Alert.alert("Payment", "Please select a payment method", [
				{ text: "OK", style: "cancel" },
			]);
			return;
		}

		navigation.navigate("Orders", {
			screen: "OrderSummary",
			params: {
				deliveryMethod: deliveryOption,
				paymentMethod: paymentOption,
				customer: deliveryInfo,
			},
		});
	};

	return (
		<Screen>
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<ScrollView
					contentContainerStyle={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View style={styles.view}>
						<Text style={styles.qty}>Items Quantity: {itemCounts}</Text>
						<Text style={styles.total}>Order Tortal: ${cartTotal}</Text>
					</View>
					<View style={{ justifyContent: "center", alignItems: "center" }}>
						<Text style={{ marginTop: 10, fontWeight: "700" }}>
							Delivery Option
						</Text>
						<View style={styles.delivery}>
							<TouchableOpacity
								onPress={() => setDeliveryOption("delivery")}
								style={{
									height: "100%",
									backgroundColor:
										deliveryOption === "delivery"
											? colors.primary
											: colors.tile,
									width: "50%",
									alignItems: "center",
									justifyContent: "center",
									flexDirection: "row",
								}}
							>
								<View>
									<Text
										style={{
											fontSize: 24,
											fontWeight: "700",
											color:
												deliveryOption === "delivery"
													? colors.secondary
													: "black",
										}}
									>
										Delivery
									</Text>
								</View>
							</TouchableOpacity>
							<View style={styles.divider}></View>
							<TouchableOpacity
								onPress={() => setDeliveryOption("pickup")}
								style={{
									height: "100%",
									backgroundColor:
										deliveryOption === "pickup" ? colors.primary : colors.tile,
									width: "50%",
									alignItems: "center",
									justifyContent: "center",
									flexDirection: "row",
								}}
							>
								<View>
									<Text
										style={{
											fontSize: 24,
											fontWeight: "700",
											color:
												deliveryOption === "pickup"
													? colors.secondary
													: "black",
										}}
									>
										Pick up
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontWeight: "700" }}>Payment Option</Text>
						<View style={styles.delivery}>
							{deliveryOption === "delivery" ? (
								<>
									<Pick
										title="credit"
										type={paymentOption}
										style={{
											color:
												paymentOption === "credit" ? colors.secondary : "black",
										}}
										onPress={() => setPaymentOption("credit")}
									/>
									<View style={styles.divider}></View>
									<Pick
										title="cash"
										style={{
											color:
												paymentOption === "cash" ? colors.secondary : "black",
										}}
										type={paymentOption}
										onPress={() => setPaymentOption("cash")}
									/>
								</>
							) : (
								<>
									<Pick
										title="credit"
										style={{
											color:
												paymentOption === "credit" ? colors.secondary : "black",
										}}
										type={paymentOption}
										onPress={() => setPaymentOption("credit")}
									/>
									<View style={styles.divider}></View>
									<Pick
										title="in store"
										style={{
											color:
												paymentOption === "in store"
													? colors.secondary
													: "black",
										}}
										type={paymentOption}
										onPress={() => setPaymentOption("in store")}
									/>
								</>
							)}
						</View>
					</View>
					<View style={styles.form}>
						{deliveryOption === "pickup" && paymentOption !== null && (
							<View style={styles.form}>
								<Text style={{ fontWeight: "700", marginTop: 5 }}>
									Person Picking Up
								</Text>
								<AppForm
									initialValues={{ name: "", lastName: "", phone: "" }}
									onSubmit={handlePickup}
									validationSchema={pickUpSchema}
								>
									<AppFormField
										name="name"
										iconName="account-badge-horizontal"
										placeholder="First Name"
									/>
									<AppFormField
										name="lastName"
										iconName="account-badge-horizontal"
										placeholder="Last Name"
									/>
									<AppFormField
										name="phone"
										iconName="phone"
										placeholder="Phone"
										maxLength={10}
										keyboardType="number-pad"
									/>
									<AppFormField
										name="email"
										placeholder="Email"
										iconName="email"
										autoCorrect={false}
										autoCapitalize="none"
										keyboardType="email-address"
										textContentType="emailAddress"
									/>
									<View style={{ marginTop: 20, width: "100%" }}>
										<AppSubmitButton title="Check Out" />
									</View>
								</AppForm>
							</View>
						)}
					</View>
					{deliveryOption === "delivery" && (
						<View style={styles.addressView}>
							<Text style={{ fontWeight: "700", marginTop: 5 }}>
								Delivery Information
							</Text>
							<AppForm
								onSubmit={handleDelivery}
								initialValues={{
									name: "",
									lastName: "",
									address: "",
									apt: "",
									city: "",
									zipcode: "",
									phone: "",
									email: "",
								}}
								validationSchema={deliverySchema}
							>
								<AppFormField
									name="name"
									textContentType="name"
									placeholder="First Name"
								/>
								<AppFormField
									name="lastName"
									textContentType="familyName"
									placeholder="Last Name"
								/>
								<AppFormField name="address" placeholder="Address" />
								<AppFormField name="apt" placeholder="Apt or Floor" />
								<AppFormField name="city" placeholder="City" />
								<AppFormField name="zipcode" placeholder="Zip Code" />
								<AppFormField
									name="phone"
									placeholder="Phone"
									keyboardType="phone-pad"
									maxLength={10}
								/>
								<AppFormField
									name="email"
									placeholder="Email"
									autoCorrect={false}
									autoCapitalize="none"
									keyboardType="email-address"
									textContentType="emailAddress"
								/>
								<View style={{ width: "100%", marginTop: 20 }}>
									<AppSubmitButton title="Check Out" />
								</View>
							</AppForm>
							<View style={{ height: 80 }}></View>
						</View>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: 10,
		justifyContent: "center",
	},
	addressView: {
		width: "100%",
		alignItems: "center",
	},
	btn: {
		width: "95%",
		marginTop: 20,
		position: "absolute",
		bottom: 5,
		backgroundColor: colors.secondary,
	},

	delivery: {
		overflow: "hidden",
		width: "95%",
		height: Dimensions.get("screen").height * 0.06,
		borderRadius: 50,
		backgroundColor: colors.tile,
		marginVertical: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		shadowOffset: {
			width: 5,
			height: 5,
		},
		shadowOpacity: 0.7,
		shadowRadius: 10,
		shadowColor: "grey",

		elevation: 10,
		borderColor: "grey",
		borderWidth: 0.5,
	},
	divider: {
		height: "100%",
		width: 2,
		backgroundColor: "grey",
	},

	form: {
		width: "100%",
		alignItems: "center",
	},
	summary: {
		fontSize: 18,
		fontWeight: "700",
		paddingBottom: 20,
	},
	view: {
		alignItems: "center",
		justifyContent: "center",
		width: "95%",
		height: Dimensions.get("screen").height * 0.15,
		elevation: 10,
		borderRadius: 5,
		shadowColor: "grey",
		shadowOffset: {
			width: 3,
			height: 3,
		},
		padding: 10,
		shadowOpacity: 0.7,
		shadowRadius: 10,
		borderColor: "grey",
		backgroundColor: colors.tile,
	},
	qty: {
		fontSize: 22,
		padding: 5,
	},
	total: {
		fontSize: 28,
		fontWeight: "bold",
		padding: 10,
	},
});

export default Checkout;
