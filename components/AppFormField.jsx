// @ts-nocheck
import React from "react";

import { useFormikContext } from "formik";

import AppInput from "./AppInput";
import AppErrorMessage from "./AppErrorMessage";

const AppFormField = ({ name, autoFocus, ...otherProps }) => {
  const { errors, touched, setFieldTouched, handleChange } = useFormikContext();

  return (
    <>
      <AppInput
        autoFocus={autoFocus}
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormField;
