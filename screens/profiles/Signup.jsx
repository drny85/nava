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
import { formatPhone } from "../../utils/formatPhone";


const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(3).label("First Name"),
  lastName: Yup.string().required().min(3).label("Last Name"),
  // phone: Yup.string().required().min(9).label("Phone"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  confirm: Yup.string().required().min(6).label("Password confirmation"),
});

const Signup = ({ route }) => {
  const navigation = useNavigation();
  const [business, setBusiness] = useState(false)
  const [phone, setPhone] = useState('')
  const { signup, createUser } = useContext(authContext);
  const { restaurant } = route.params


  const { previewRoute, clearSettings } = useContext(settingsContext);

  const handleSignup = async (values) => {
    try {
      if (phone.length < 10) {
        alert('Phone is invalid')
        return;
      }

      if (values.password !== values.confirm) {
        alert('Passwords must match')
        return;
      }
      const data = await signup(values.email.trim(), values.password.trim());
      if (!data) return;

      // setUser({ id: data.user.uid, email: data.user.email });

      await createUser(
        data.user.uid,
        values.name,
        values.lastName,
        values.phone = phone,
        values.email,

      );

      // await saveToken(pushToken);
      console.log(previewRoute)
      if (previewRoute) {
        navigation.navigate(previewRoute, { restaurant });
        //clearSettings();

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
      setBusiness(false)
      clearSettings()
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
                phone: phone,
                email: "",
                password: "",
                confirm: ''
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
                value={phone}
                minLength={10}
                maxLength={14}
                onChangeText={text => {
                  setPhone(text)
                  if (text.length >= 10) {
                    setPhone(
                      formatPhone(text))
                  }


                }}
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
              <AppFormField
                placeholder="Confirm Password"
                name="confirm"
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
