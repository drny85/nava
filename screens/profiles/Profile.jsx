// @ts-nocheck
import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Image,
} from "react-native";
import Screen from "../../components/Screen";
import authContext from "../../context/auth/authContext";
import Signin from "./Signin";
import useNotifications from "../../hooks/useNotifications";
import { Dimensions } from "react-native";
import ProfileItem from "../../components/ProfileItem";
import * as ImagePicker from "expo-image-picker";

import { Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { storage, db } from "../../services/database";
import { Modal } from "react-native";
import { COLORS } from "../../config";

const Profile = ({ navigation }) => {
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { user, setUser } = useContext(authContext);

  if (!user) return <Signin />;

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert("We need you camera permission");
    setHasPermission(granted);
    await handleImagePicker();
  };

  const saveOrChangeImageToDatabase = async (result) => {
    try {
      const { uri } = result;
      const ext = uri.split(".").pop();
      const filename = user.id + "-profile" + "." + ext;
      const response = await fetch(uri);
      const blob = await response.blob();

      if (user.imageUrl) {
        const ref = storage.ref(`profile/${filename}`);
        if (ref) {
          await ref.delete();
        }
      }

      const ref = storage
        .ref(`profile/${filename}`)
        .put(blob, { contentType: "image/jpeg" });

      ref.on(
        "state_changed",
        (s) => {
          let progress = (s.bytesTransferred / s.totalBytes) * 100;
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const imageUrl = await ref.snapshot.ref.getDownloadURL();
          if (imageUrl) {
            try {
              await db.collection("appUser").doc(user.id).update({ imageUrl });
              await setUser(user.id);
            } catch (error) {
              console.log("error saving image to user", error);
            }
          }
        }
      );
    } catch (error) {
      console.log("Error from saving image", error);
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,

        allowsEditing: true,
      });
      if (!result.cancelled) {
        setImage(result.uri);
        Alert.alert(
          "Do you want to change?",
          "Are you happy with this image?",
          [
            {
              text: "Save it",
              onPress: () => saveOrChangeImageToDatabase(result),
            },
            {
              text: "No",
              style: "cancel",
              onPress: () => (user.imageUrl ? setImage(user.imageUrl) : null),
            },
          ]
        );
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.image_view}>
        <TouchableWithoutFeedback onPress={requestPermission}>
          <Image
            style={styles.img}
            source={{
              uri: !user.imageUrl
                ? "https://p7.hiclipart.com/preview/340/956/944/computer-icons-user-profile-head-ico-download.jpg"
                : user.imageUrl,
            }}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.profile_view}>
        <ProfileItem
          text="my orders"
          onPress={() => navigation.navigate("Orders", { previous: "Profile" })}
        />
        <ProfileItem text="Personal Info" onPress={() => setShow(true)} />
        <ProfileItem
          text="My Delivery Addresses"
          onPress={() => navigation.navigate("MyAddress", { previous: null })}
        />
        <ProfileItem
          text="Favorite Restaurants"
          onPress={() =>
            navigation.navigate("Favorites", { previous: "Profile" })
          }
        />
      </View>
      <Modal visible={show} animationType="slide">
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={() => setShow(false)}>
            <View style={styles.back}>
              <Feather
                name="x"
                style={{ fontWeight: "700" }}
                size={24}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
          <View>
            <Text>
              Name: {user.name} {user.lastName}
            </Text>
            <Text>Phone: {user.phone}</Text>
            <Text>Email: {user.email}</Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  back: {
    position: "absolute",
    top: 50,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 50,
    zIndex: 3,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: Dimensions.get("screen").height / 2,
  },
  image_view: {
    width: Dimensions.get("screen").height * 0.3,
    height: Dimensions.get("screen").height * 0.3,
    borderRadius: Dimensions.get("screen").height / 2,
    marginVertical: 10,
  },
  modal: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profile_view: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});

export default Profile;
