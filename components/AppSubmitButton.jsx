import React from "react";

import { useFormikContext } from "formik";
import AppButton from "./AppButton";

const AppSubmitButton = ({ title }) => {
  const { handleSubmit, isValid } = useFormikContext();
  console.log(isValid);
  return <AppButton title={title} disable={isValid} onPress={handleSubmit} />;
};

export default AppSubmitButton;
