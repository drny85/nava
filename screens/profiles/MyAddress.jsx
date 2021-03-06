// @ts-nocheck
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import AddressTile from "../../components/AddressTile";
import { Ionicons } from "@expo/vector-icons";
import AppForm from "../../components/AppForm";

import * as Yup from "yup";
import AppFormField from "../../components/AppFormField";
import AppSubmitButton from "../../components/AppSubmitButton";

import authContext from "../../context/auth/authContext";

import { Alert } from "react-native";
import SwipeDelete from "../../components/SwipeDelete";
import Divider from "../../components/Divider";
import { COLORS } from "../../config";

const addressSchema = Yup.object().shape({
  street: Yup.string().required().label("Street"),
  apt: Yup.string(),
  city: Yup.string().required().label("City"),
  zipcode: Yup.string().required().min(5).label("Zip code"),
});

const MyAddress = ({ navigation, route }) => {
  const { user, saveDeliveryAddress, deleteUserAddress, loading } = useContext(
    authContext
  );
  //   const [address, setAddres] = useState(null);
  const [visible, setVisible] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const { deliveryAddresses } = user;

  const { previous } = route.params;

  const handleAddressPress = (item) => {
    navigation.navigate("Checkout", { previous: item });
  };

  const addNewAddress = async (address) => {
    try {
      address.userId = user?.id;
      const result = await saveDeliveryAddress(address);

      if (result.message === true) {
        setVisible(false);
      } else {
        Alert.alert("Sorry", `${result.message}`, [
          { text: "OK", style: "default" },
        ]);
      }
    } catch (error) {
      console.log("Error addNewAddress", error);
    }
  };

  const handleDelete = async (item) => {
    const deleted = deleteUserAddress(item);
  };

  const deleteAddressHandler = (item) => {
    Alert.alert("Deleting", "Do you want to delete this address?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(item),
      },
      { text: "No", style: "cancel" },
    ]);
  };

  useEffect(() => {
    if (deliveryAddresses) setAddresses(deliveryAddresses);
  }, [user]);

  return (
    <Screen style={styles.container}>
      <AppButton
        style={styles.btn}

        title="Add New Address"
        onPress={() => setVisible(true)}
      />
      {addresses.length === 0 ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 16 }}>No Preferred Address</Text>
        </View>
      ) : (
          <View style={styles.mainView}>
            <FlatList
              ItemSeparatorComponent={() => <Divider />}
              data={addresses.sort((a, b) => b.dateAdded > a.dateAdded)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <AddressTile
                  address={item}
                  onPress={() => (previous ? handleAddressPress(item) : null)}
                  renderRightActions={() => (
                    <SwipeDelete onPress={() => deleteAddressHandler(item)} />
                  )}
                />
              )}
            />
          </View>
        )}

      <Modal
        visible={visible}
        presentationStyle="overFullScreen"
        animationType="slide"
        onDismiss={() => setVisible(false)}
        onRequestClose={() => console.log("closing")}
      >
        <ScrollView>
          <Screen style={styles.viewModal}>
            <Ionicons
              onPress={() => setVisible(false)}
              style={styles.modalClose}
              name="ios-close"
              allowFontScaling={true}
              size={38}
              color="black"
            />
            <View style={styles.modalForm}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "montserrat-bold",
                  fontSize: 20,
                  marginBottom: 20,
                }}
              >
                Delivery Address
              </Text>
              <AppForm
                initialValues={{ street: "", apt: "", city: "", zipcode: "" }}
                validationSchema={addressSchema}
                onSubmit={addNewAddress}
              >
                <AppFormField
                  name="street"
                  style={{ textTransform: "capitalize" }}
                  autoCapitalize="words"
                  placeholder="Street number and name"
                />
                <AppFormField name="apt" placeholder="Apt, Suite, Floor" />
                <AppFormField
                  style={styles.text}
                  name="city"
                  placeholder="City"
                />
                <AppFormField
                  name="zipcode"
                  keyboardType="numeric"
                  placeholder="Zip Code, Postal Code"
                />

                <AppSubmitButton
                  style={{ marginTop: 20 }}
                  title="Save Address"
                />
              </AppForm>
            </View>
          </Screen>
        </ScrollView>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },

  btn: {
    width: "80%",
    marginVertical: 10,

  },
  mainView: {
    flex: 1,
  },

  viewModal: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
  },

  modalClose: {
    position: "absolute",
    left: 10,
    top: 20,
    padding: 10,
  },
  modalForm: {
    padding: 10,
    width: "100%",
    marginTop: 100,
  },

  text: {
    textTransform: "capitalize",
  },
});

export default MyAddress;
