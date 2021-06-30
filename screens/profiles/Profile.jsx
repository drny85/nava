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
import ProfileItem from "../../components/ProfileItem";
import * as ImagePicker from "expo-image-picker";

import { Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { storage, db } from "../../services/database";
import { Modal } from "react-native";
import { COLORS, FONTS, SIZES } from "../../config";
import { TextInput } from "react-native";
import { formatPhone } from "../../utils/formatPhone";
import AppButton from "../../components/AppButton";
import SuccessAlert from "../../components/SuccessAlert";
import { isEmailValid } from "../../utils/isEmailValide";

const Profile = ({ navigation }) => {
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingProfile, setEdidingProfile] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { user, setUser, updateUserProfile } = useContext(authContext);


  if (!user) return <Signin />;

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert("We need you camera permission");
    setHasPermission(granted);
    await handleImagePicker();
  };

  const handleProfileUpdate = async () => {
    try {
      let valid = isEmailValid(email)
      if (!valid) {
        alert('Invalid email')
        return;
      }
      if (phone.length < 10) {
        alert('Invalid Phone Number')
        return
      }

      const sucess = await updateUserProfile({ phone, email })
      if (sucess) {
        //setEdidingProfile(false)
        setSuccess(true)
      }
    } catch (error) {
      console.log('Error at updating Profile', error)
    }

  }


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



  if (success) return <SuccessAlert visible={success} onFinish={() => { setSuccess(false); setEdidingProfile(false) }} />

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
          onPress={() => navigation.navigate("MyOrders", { previous: 'Profile' })}
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

      <Modal visible={show} style={{ flex: 1 }} animationType="slide">
        <View style={{ flex: 1 }}>
          {editingProfile ? (<View style={styles.editView}>
            <View style={styles.topView}>
              <TouchableWithoutFeedback onPress={() => setEdidingProfile(false)}>
                <View>
                  <Feather
                    name="x"
                    style={{ fontWeight: "700" }}
                    size={24}
                    color={COLORS.black}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => null}>
                <View>
                  <Feather
                    name="save"
                    style={{ fontWeight: "700" }}
                    size={24}
                    color={COLORS.black}
                  />
                </View>
              </TouchableWithoutFeedback>

            </View>
            <View>

              <TextInput style={styles.textInput} placeholder='New Phone' maxLength={146666} placeholderTextColor={COLORS.text} value={phone} onChangeText={(text => setPhone(formatPhone(text)))} />
              <TextInput style={styles.textInput} placeholder='New Email' value={email} onChangeText={(text => setEmail(text.trim().toLowerCase()))} />
              <View style={{ width: SIZES.width * 0.8, alignSelf: 'center', marginVertical: 15, }}>
                <AppButton title='Update' onPress={handleProfileUpdate} />
              </View>
              <Text style={{ ...FONTS.body5 }}>Note: By changing your email address, you are not changing your login information.</Text>
            </View>
          </View>) : (
              <View style={styles.modal}>
                <View style={styles.topView}>
                  <TouchableWithoutFeedback onPress={() => setShow(false)}>
                    <View>
                      <Feather
                        name="x"
                        style={{ fontWeight: "700" }}
                        size={24}
                        color={COLORS.black}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => setEdidingProfile(true)}>
                    <View>
                      <Feather
                        name="edit"
                        style={{ fontWeight: "700" }}
                        size={24}
                        color={COLORS.black}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                </View>

                <View>

                  <Text style={styles.profileText}>
                    Name: {user.name} {user.lastName}
                  </Text>
                  <Text style={styles.profileText}>Phone: {formatPhone(user.phone)}</Text>
                  <Text style={styles.profileText}>Email: {user.email}</Text>
                </View>
              </View>
            )}
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
  editView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: SIZES.height / 2,
  },
  image_view: {
    width: SIZES.height * 0.3,
    height: SIZES.height * 0.3,
    borderRadius: SIZES.height / 2,
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

  profileText: {
    ...FONTS.body3,
    marginBottom: 10,
  },
  topView: {
    position: 'absolute',
    top: SIZES.statusBarHeight + 15, left: 0, right: 0, justifyContent: 'space-between',
    flexDirection: 'row', marginHorizontal: SIZES.padding,
  },
  textInput: {
    width: SIZES.width * 0.9, paddingHorizontal: SIZES.padding * 0.4,
    paddingVertical: SIZES.padding * 0.4, borderRadius: SIZES.radius,
    backgroundColor: COLORS.tile,
    ...FONTS.body4,
    overflow: 'hidden',
    borderBottomColor: COLORS.lightGray, borderBottomWidth: 0.5,
    marginBottom: SIZES.padding,
  }
});

export default Profile;
