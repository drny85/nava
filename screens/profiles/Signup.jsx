// @ts-nocheck
import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Yup from "yup";
import Screen from "../../components/Screen";
import AppFormField from "../../components/AppFormField";
import AppSubmitButton from "../../components/AppSubmitButton";
import AppForm from "../../components/AppForm";

import authContext from "../../context/auth/authContext";
import colors from "../../config/colors";
import useNotifications from "../../hooks/useNotifications";
import settingsContext from "../../context/settings/settingsContext";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(3).label("First Name"),
  lastName: Yup.string().required().min(3).label("Last Name"),
  phone: Yup.string().required().min(9).label("Phone"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const Signup = () => {
  const navigation = useNavigation();
  const { signup, createUser } = useContext(authContext);
  const { previewRoute, clearSettings } = useContext(settingsContext);
  const handleSignup = async (values) => {
    try {
      const data = await signup(values.email, values.password);
      if (!data) return;

      // setUser({ id: data.user.uid, email: data.user.email });
      await createUser(
        data.user.uid,
        values.name,
        values.lastName,
        values.email,
        values.phone
      );

      // await saveToken(pushToken);
      if (previewRoute) {
        navigation.navigate(previewRoute);
        clearSettings();

        return;
      }

      navigation.navigate("Profile");
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

  useEffect(() => {
    return () => {
      console.log("left");
    };
  }, []);

  return (
    <Screen>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView>
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
              iconName="account-badge-horizontal"
              name="name"
              autoCorrect={false}
            />
            <AppFormField
              placeholder="Last Name"
              iconName="account-badge-horizontal"
              name="lastName"
              autoCorrect={false}
            />
            <AppFormField
              placeholder="Phone"
              iconName="phone"
              name="phone"
              maxLength={10}
              keyboardType="phone-pad"
              autoCorrect={false}
            />
            <AppFormField
              placeholder="Email"
              keyboardType="email-address"
              iconName="email"
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
              iconName="lock-open"
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
      </TouchableWithoutFeedback>
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
    color: colors.primary,
    fontSize: 18,
  },
  signupText: {
    fontSize: 18,
    color: "blue",
    marginLeft: 10,
  },
});

export default Signup;
