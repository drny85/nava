import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";

import { Formik } from "formik";

const Signin = () => {
  return (
    <Screen style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => console.log(values)}
      >
        {({ errors, touched, handleChange, handleSubmit }) => (
          <>
            <AppInput
              placeholder="Email"
              keyboardType="email-address"
              icon="email"
              onChangeText={handleChange("email")}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <AppInput
              placeholder="Password"
              onChangeText={handleChange("password")}
              secureTextEntry={true}
              autoCorrect={false}
              icon="lock-open"
            />
            <AppButton
              style={styles.btn}
              title="Login"
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  btn: {
    marginTop: 20,
  },
});

export default Signin;
