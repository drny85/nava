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

import settingsContext from "../../context/settings/settingsContext";
import cartContext from "../../context/cart/cartContext";
import storesContext from "../../context/stores/storesContext";
import { COLORS, FONTS, SIZES } from "../../config";
import { Button } from "react-native";
import { Modal } from "react-native";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import FloatingButton from "../../components/FloatingButton";
import Loader from "../../components/Loader";
import { auth } from "../../services/database";
import { isEmailValid } from "../../utils/isEmailValide";

const validationSchema = Yup.object().shape({
	email: Yup.string().required().email().label("Email"),
	password: Yup.string().required().min(6).label("Password"),
});

const Signin = () => {
	const navigation = useNavigation()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { login, setUser, updateLastLogin, resetPassword, loading } = useContext(authContext);
	const { previewRoute, clearSettings } = useContext(settingsContext);
	const [modalReset, setModalReset] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(null)
	const [resetEmail, setResetEmail] = useState('')
	const { cartItems } = useContext(cartContext)
	const { stores } = useContext(storesContext)
	const restaurants = [...stores];
	const restaurant = restaurants.find(s => s.id === cartItems[0]?.storeId)


	const handleResetEmail = async (e) => {
		e.preventDefault()

		if (resetEmail === '') {
			return
		}

		if (isEmailValid(resetEmail)) {

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

	const handleSignin = async () => {
		try {
			if (email === '' || password.length < 6) {
				alert('Botth fields are required')
				return;
			} else if (!isEmailValid(email.trim())) {
				alert('Invalid Email')
				return
			}
			const { user } = await auth.signInWithEmailAndPassword(email.trim(), password.trim())
			if (user) {
				setUser(user.uid)
				if (previewRoute) {
					navigation.navigate('CartTab', { screen: previewRoute, params: restaurant })
				} else {
					navigation.navigate('Profile')
				}
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
	}

	// const handleSignin = async ({ email, password }) => {
	// 	try {
	// 		const { user } = await login(email.trim(), password.trim());

	// 		console.log('P', previewRoute)
	// 		if (user.uid) {
	// 			setUser(user.uid)
	// 			if (previewRoute) { navigation.navigate('CartTab', { screen: previewRoute, params: restaurant }) }
	// 			else {
	// 				navigation.navigate('Profile')
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		Alert.alert(
	// 			"Error",
	// 			error.message,
	// 			[{ text: "OK", onPress: () => console.log("OK Pressed") }],
	// 			{ cancelable: false }
	// 		);
	// 	}
	// };



	if (loading) return <Loader />
	return (
		<Screen>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<KeyboardAvoidingView

					style={styles.container}
					behavior={Platform.OS === 'ios' ? 'padding' : null} enabled
				>
					{/* <AppForm
						initialValues={{ email: "", password: "" }}
						onSubmit={handleSignin}
						validationSchema={validationSchema}
					> */}
					<TextInput
						autoFocus={true}
						placeholder="Email"
						keyboardType="email-address"
						icon="email"
						name="email"
						style={styles.input}
						placeholderTextColor={COLORS.lightGray}
						value={email}
						onChangeText={text => setEmail(text.trim())}
						autoCorrect={false}
						autoCapitalize="none"
						textContentType="emailAddress"
					/>

					<TextInput
						placeholder="Password"
						name="password"
						value={password}
						style={styles.input}
						onChangeText={text => setPassword(text.trim())}
						secureTextEntry={true}
						autoCorrect={false}

						textContentType="password"
					/>

					<AppButton title="Login" style={{ marginTop: 15, borderBottomWidth: 0.5, borderColor: COLORS.light }} onPress={handleSignin} />
					{/* </AppForm> */}
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
					{/* {modalReset && (
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
					)} */}
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
		color: COLORS.primary,
		fontSize: 18,
	},
	signupText: {
		fontSize: 18,
		color: "blue",
		marginLeft: 10,
	},
	input: {
		width: "100%",
		paddingVertical: SIZES.padding * 0.5,
		paddingHorizontal: SIZES.padding * 0.5,
		marginVertical: SIZES.padding * 0.5,
		padding: 8,
		borderRadius: 25,
		alignItems: "center",
		backgroundColor: COLORS.tile,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: COLORS.light,
		...FONTS.body3
	}
});

export default Signin;
