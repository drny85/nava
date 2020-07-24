import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as Yup from "yup";

import authContext from "../context/auth/authContext";
import settingsContext from "../context/settings/settingsContext";
import Screen from "../components/Screen";
import AppForm from "../components/AppForm";
import AppFormField from "../components/AppFormField";
import { ScrollView } from "react-native-gesture-handler";
import AppSubmitButton from "../components/AppSubmitButton";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  lastName: Yup.string().required().label("Last Name"),
  address: Yup.string().required().label("Address"),
  apt: Yup.string(),
  city: Yup.string().required().label("City"),
  zipcode: Yup.string().required().min(5).label("Zip code"),
});

const Payment = ({ navigation }) => {
  const { user } = useContext(authContext);
  const { deliveryMethod } = useContext(settingsContext);

  console.log(deliveryMethod);

  if (!user) {
    navigation.navigate("Profile", {
      previewRoute: "Payment",
    });
  }

  const handlePayment = async (values) => {
    console.log(values);
  };

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <AppForm
          initialValues={{ name: "" }}
          onSubmit={handlePayment}
          validationSchema={validationSchema}
        >
          <AppFormField
            value={user.name}
            autoFocus={true}
            placeholder="Name"
            name="name"
            autoCorrect={false}
          />
          <AppFormField
            value={user.lastName}
            placeholder="Last Name"
            name="lastName"
            autoCorrect={false}
          />

          <AppFormField
            placeholder="Address"
            name="address"
            textContentType="streetAddressLine1"
            autoCorrect={false}
          />
          <AppFormField
            placeholder="Apt, Suite"
            name="apt"
            textContentType="streetAddressLine2"
            autoCorrect={false}
          />
          <AppFormField placeholder="City" name="city" autoCorrect={false} />
          <AppFormField
            placeholder="Zip Code"
            name="zipcode"
            autoCorrect={false}
            keyboardType="number-pad"
            textContentType="postalCode"
          />
          <AppSubmitButton disable={false} title="Pay" />
        </AppForm>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginHorizontal: 10,
  },
});

export default Payment;
