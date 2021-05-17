// @ts-nocheck
import React, { useContext, useState } from "react";
import {
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	View,
	Keyboard,
	Text,
	Alert,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Yup from "yup";
import Screen from "../../components/Screen";
import AppFormField from "../../components/AppFormField";
import AppSubmitButton from "../../components/AppSubmitButton";
import AppForm from "../../components/AppForm";

import authContext from "../../context/auth/authContext";
import colors from "../../config/colors";
import settingsContext from "../../context/settings/settingsContext";
import cartContext from "../../context/cart/cartContext";
import storesContext from "../../context/stores/storesContext";
import { COLORS, FONTS, SIZES } from "../../config";
import { Button } from "react-native";
import { Modal } from "react-native";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import FloatingButton from "../../components/FloatingButton";


const validationSchema = Yup.object().shape({
	email: Yup.string().required().email().label("Email"),
	password: Yup.string().required().min(6).label("Password"),
});

const Signin = ({ route }) => {
	const navigation = useNavigation();
	const { user, login, setUser, updateLastLogin, resetPassword } = useContext(authContext);
	const { previewRoute, clearSettings } = useContext(settingsContext);
	const [modalReset, setModalReset] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(null)
	const [resetEmail, setResetEmail] = useState('')
	const { cartItems } = useContext(cartContext)
	const { stores } = useContext(storesContext)

	const restaurants = [...stores];
	const restaurant = restaurants.find(s => s.id === cartItems[0]?.storeId)


	// const { restaurant } = route.params
	const handleResetEmail = async (e) => {
		e.preventDefault()

		if (resetEmail === '') {
			return
		}

		if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(resetEmail)) {

			resetPassword(resetEmail)
			setSuccess(true)

		} else {
			setError('invalid email')
			success(false)
			setTimeout(() => {
				setError(null)
			}, 3000)
		}
	}

	const handleSignin = async ({ email, password }) => {
		try {
			const data = await login(email, password);
			if (data.user) {
				setUser(data.user.uid);
				updateLastLogin(data.user.uid);
				console.log(previewRoute)
				if (previewRoute) {
					navigation.navigate(previewRoute, { restaurant });
					clearSettings();

					return;
				}
				navigation.navigate("Profile");
				console.log('no Previous')
			}
		} catch (error) {
			console.log(error);
			Alert.alert(
				"Error",
				error.message,
				[{ text: "OK", onPress: () => console.log("OK Pressed") }],
				{ cancelable: false }
			);
		}
	};


	return (
		<Screen>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<KeyboardAvoidingView

					style={styles.container}
					behavior={Platform.OS === 'ios' ? 'padding' : null} enabled
				>
					<AppForm
						initialValues={{ email: "", password: "" }}
						onSubmit={handleSignin}
						validationSchema={validationSchema}
					>
						<AppFormField
							autoFocus={true}
							placeholder="Email"
							keyboardType="email-address"
							icon="email"
							name="email"
							autoCorrect={false}
							autoCapitalize="none"
							textContentType="emailAddress"
						/>

						<AppFormField
							placeholder="Password"
							name="password"
							secureTextEntry={true}
							autoCorrect={false}
							icon="lock-open"
							textContentType="password"
						/>

						<AppSubmitButton style={{ width: '90%', marginTop: 20 }} title="Login" />
					</AppForm>
					<View style={styles.account}>
						<Text style={{ ...FONTS.body6 }}>Don't have an account?</Text>

						<TouchableOpacity onPress={() => navigation.navigate("Signup", { restaurant })}>
							<Text style={styles.signupText}>Sign Up</Text>
						</TouchableOpacity>

					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 0, right: 0, bottom: 30, justifyContent: 'center' }}>

						<Text style={{ ...FONTS.body4 }}>Forgot password?</Text>
						<Button title='Reset' onPress={() => setModalReset(true)} />

					</View>
					{modalReset && (
						<Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Modal style={{ backgroundColor: COLORS.ascent }} animationType='slide' visible={modalReset}>
								<FloatingButton
									style={{ position: 'absolute', top: 60, right: 20, zIndex: 99 }}
									iconName="x"
									onPress={() => {
										setError(null)
										setResetEmail('')
										setSuccess(false)
										setModalReset(false)
									}}
								/>


								<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: SIZES.width }}>
									{!success && (
										<>
											<Text style={{ ...FONTS.h2, marginBottom: 20 }}>Password Reset</Text>
											<TextInput autoCapitalize='none' placeholderTextColor={COLORS.secondary} keyboardType='email-address' style={{ height: 50, borderBottomWidth: 0.6, width: SIZES.width * 0.9, paddingHorizontal: 20, borderRadius: 120, backgroundColor: COLORS.card, textTransform: 'lowercase', ...FONTS.body3 }} placeholder='Email Address' autoFocus autoCorrect={false} onChangeText={text => setResetEmail(text)} />
											<AppButton style={{ marginTop: 30, width: '90%', }} title='Request Reset Email' disabled={!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(resetEmail))} onPress={handleResetEmail} />
											{error && (<Text style={{ ...FONTS.body5, color: 'red', textAlign: 'left', marginTop: 10 }}>{error}</Text>)}

										</>

									)}

									{success && (
										<View>
											<Text style={{ ...FONTS.h4, textAlign: 'center' }}>Email Sent!</Text>
											<Text style={{ ...FONTS.body3, marginTop: 15, padding: 10, lineHeight: 30 }}>An email has been sent to {resetEmail}. Please check your email to reset your password</Text>
										</View>)
									}
								</View>

							</Modal>
						</Screen>
					)}
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</Screen >
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 8,
	},
	btn: {
		marginTop: 25,
		paddingTop: 10,
	},
	account: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	text: {
		color: colors.primary,
		fontSize: 18,
	},
	signupText: {
		fontSize: 18,
		color: "blue",
		marginLeft: 10,
	},
});

export default Signin;
