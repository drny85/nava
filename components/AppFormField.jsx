// @ts-nocheck
import React from "react";

import { useFormikContext } from "formik";

import AppInput from "./AppInput";
import AppErrorMessage from "./AppErrorMessage";

const AppFormField = ({ name, autoFocus, style, ...otherProps }) => {
  const {
    errors,
    touched,
    values,
    setFieldTouched,
    handleChange,
    setFieldValue,
  } = useFormikContext();

  return (
    <>
      <AppInput
        autoFocus={autoFocus}
        style={style}
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormField;
