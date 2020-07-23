// @ts-nocheck
import React, { useContext } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Yup from "yup";
import Screen from "../components/Screen";
import AppFormField from "../components/AppFormField";
import AppSubmitButton from "../components/AppSubmitButton";
import AppForm from "../components/AppForm";

import authContext from "../context/auth/authContext";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const Signin = () => {
  const navigation = useNavigation();
  const { user, login, setUser } = useContext(authContext);
  const handleSignin = async ({ email, password }) => {
    try {
      const data = await login(email, password);
      if (data.user) {
        setUser({ id: data.user.uid, email: data.user.email });
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

  if (user) {
    navigation.navigate("Profile");
  }
  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
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

          <AppSubmitButton title="Login" />
        </AppForm>
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
});

export default Signin;
