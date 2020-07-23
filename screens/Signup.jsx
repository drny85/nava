// @ts-nocheck
import React, { useContext } from "react";
import {
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	View,
	Text,
	Alert,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Yup from "yup";
import Screen from "../components/Screen";
import AppFormField from "../components/AppFormField";
import AppSubmitButton from "../components/AppSubmitButton";
import AppForm from "../components/AppForm";

import authContext from "../context/auth/authContext";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
	name: Yup.string().required().min(3).label("First Name"),
	lastName: Yup.string().required().min(3).label("Last Name"),
	phone: Yup.string().required().min(9).label("Phone"),
	email: Yup.string().required().email().label("Email"),
	password: Yup.string().required().min(6).label("Password"),
});

const Signup = () => {
	const navigation = useNavigation();
	const { user, signup, setUser, createUser } = useContext(authContext);
	const handleSignup = async (values) => {
		try {
			const data = await signup(values.email, values.password);
			if (data.user) {
				// setUser({ id: data.user.uid, email: data.user.email });
				createUser(data.user.uid, values.name, values.lastName, values.phone);
				navigation.navigate("Profile");
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

	React.useEffect(() => {
		return () => {
			console.log("left");
		};
	}, []);

	return (
		<Screen>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS == "ios" ? "padding" : "height"}
			>
				<AppForm
					initialValues={{
						name: "",
						lastName: "",
						phone: "",
						email: "",
						password: "",
					}}
					onSubmit={handleSignup}
					validationSchema={validationSchema}
				>
					<AppFormField
						autoFocus={true}
						placeholder="Name"
						icon="account-badge-horizontal"
						name="name"
						autoCorrect={false}
					/>
					<AppFormField
						placeholder="Last Name"
						icon="account-badge-horizontal"
						name="lastName"
						autoCorrect={false}
					/>
					<AppFormField
						placeholder="Phone"
						icon="phone"
						name="phone"
						keyboardType="phone-pad"
						autoCorrect={false}
					/>
					<AppFormField
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

					<AppSubmitButton title="Sign Up" />
				</AppForm>
				<View style={styles.account}>
					<Text style={styles.text}>Already have an account?</Text>
					<TouchableOpacity onPress={() => navigation.navigate("Signin")}>
						<Text style={styles.signupText}>Sign In</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</Screen>
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
		color: colors.secondary,
		fontSize: 18,
	},
	signupText: {
		fontSize: 18,
		color: "blue",
		marginLeft: 10,
	},
});

export default Signup;