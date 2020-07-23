import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { Formik } from "formik";
import * as Yup from "yup";

import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import AppErrorMessage from "../components/AppErrorMessage";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

const Signin = () => {
  return (
    <Screen style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        {({ errors, touched, handleChange, handleSubmit, setFieldTouched }) => (
          <>
            <AppInput
              placeholder="Email"
              keyboardType="email-address"
              icon="email"
              onBlur={() => setFieldTouched("email")}
              onChangeText={handleChange("email")}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <AppErrorMessage error={errors.email} visible={touched.email} />
            <AppInput
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              secureTextEntry={true}
              autoCorrect={false}
              icon="lock-open"
              textContentType="password"
            />
            <AppErrorMessage
              error={errors.password}
              visible={touched.password}
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
