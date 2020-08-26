// @ts-nocheck
import React from "react";

import { useFormikContext } from "formik";
import AppButton from "./AppButton";
import { StyleSheet } from "react-native";

const AppSubmitButton = ({ title, style }) => {
	const { handleSubmit } = useFormikContext();

	return (
		<AppButton
			style={[styles.container, style]}
			title={title}
			onPress={handleSubmit}
		/>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default AppSubmitButton;
