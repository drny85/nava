// @ts-nocheck
import React, { useEffect, useContext, useState } from "react";
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
import useNotifications from "../../hooks/useNotifications";
import settingsContext from "../../context/settings/settingsContext";
import { COLORS, FONTS } from "../../config";
import AppButton from "../../components/AppButton";


const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(3).label("First Name"),
  lastName: Yup.string().required().min(3).label("Last Name"),
  phone: Yup.string().required().min(9).label("Phone"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const Signup = ({ route }) => {
  const navigation = useNavigation();
  const [business, setBusiness] = useState(false)
  const { signup, createUser } = useContext(authContext);
  const { restaurant } = route.params


  const { previewRoute, clearSettings } = useContext(settingsContext);

  const handleSignup = async (values) => {
    try {
      const data = await signup(values.email.trim(), values.password.trim());
      if (!data) return;

      // setUser({ id: data.user.uid, email: data.user.email });
      await createUser(
        data.user.uid,
        values.name,
        values.lastName,
        values.phone,
        values.email,

      );

      // await saveToken(pushToken);
      if (previewRoute) {
        navigation.navigate(previewRoute, { restaurant });
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
      setBusiness(null)
    };
  }, []);

  if (business === null) {
    return <Screen>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '60%', height: '30%', justifyContent: 'space-around', alignItems: 'center' }}>
          <Text style={{ ...FONTS.h3 }}>Account Type</Text>
          <AppButton title='Customer' onPress={() => setBusiness(false)} />
          <AppButton title='Business' onPress={() => navigation.navigate('Business')} />

        </View>

      </View>
    </Screen>
  }

  return (
    <Screen>
      {business === false && (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView style={styles.container}>
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
                iconName="account-circle"
                name="name"
                autoCorrect={false}
              />
              <AppFormField
                placeholder="Last Name"
                iconName="account-circle"
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

              <AppSubmitButton title="Sign Up" style={{ width: '80%', marginTop: 30, }} />
            </AppForm>
            <View style={styles.account}>
              <Text style={styles.text}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                <Text style={styles.signupText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}

    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

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
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
  },
  text: {
    color: COLORS.black,
    fontSize: 18,
  },
  signupText: {
    fontSize: 18,
    color: "blue",
    marginLeft: 10,
  },
});

export default Signup;
