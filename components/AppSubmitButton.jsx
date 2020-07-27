import React from "react";

import { useFormikContext } from "formik";
import AppButton from "./AppButton";

const AppSubmitButton = ({ title }) => {
  const { handleSubmit, isValid } = useFormikContext();
  console.log("DISABLE", isValid);
  return <AppButton title={title} onPress={handleSubmit} />;
};

export default AppSubmitButton;
