// @ts-nocheck
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { Modal } from "react-native";
import { StyleSheet, FlatList, Text, View, TouchableOpacity, Animated } from "react-native";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

import Loader from "../../components/Loader";
import RecentOrderCard from "../../components/RecentOrderCard";
import Screen from "../../components/Screen";
import SearchBar from "../../components/SearchBar";
import StoreCard from "../../components/StoreCard";
import { COLORS, FONTS, SIZES } from "../../config";
import authContext from "../../context/auth/authContext";
import ordersContext from "../../context/order/orderContext";

//import { useLocation } from '../../hooks/useLocation'

import storesContext from "../../context/stores/storesContext";
import cartContext from "../../context/cart/cartContext";
import { Alert } from "react-native";
import itemsContext from "../../context/items/itemsContext";
import useLocation from "../../utils/useLocation";


const SPACING = SIZES.padding
const ITEM_SIZE = (SIZES.height * 0.25) + SPACING * 2


const Restaurants = ({ navigation }) => {

  //const location = null;
  const scrollY = useRef(new Animated.Value(0)).current
  const { stores, getStores, loading } = useContext(storesContext);
  const { items, getItems } = useContext(itemsContext);
  const { user } = useContext(authContext);
  const [onlyLocal, setOnlyLocal] = useState(true)
  const [location, errorMsg] = useLocation(onlyLocal)
  const { addToCart, cartItems, clearCart, calculateCartTotal } = useContext(
    cartContext
  );
  const { orders, getOrders } = useContext(ordersContext);
  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [adding, setAdding] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [text, setText] = useState("");

  // const { address, isloading } = useLocation()


  const fetchStores = (restaurant) => {
    if (!restaurant.open) {
      Alert.alert("CLOSED", "Store already closed", [
        { text: "OK", style: "cancel" },
      ]);
      return;
    }
    navigation.navigate("Home", { restaurant });
  };

  //handle modal press
  const modalHandler = (order) => {
    setShowModal(true);
    setRestaurant(order?.restaurant);
    setOrder(order);
  };

  const addThem = async () => {
    try {
      setAdding(true);
      for (let index = 0; index < order.items.length; index++) {
        const element = order.items[index];

        await addToCart(element);
        calculateCartTotal(order.items);
      }
      setShowModal(false);
      setAdding(false);
      navigation.navigate("Cart");
    } catch (error) {
      console.log("Error adding items to cart", error);
    }
  };

  //add all items to cart from selected previous order and go to cart
  const addItemsToCart = async () => {
    // check if there ir already items in cart
    if (cartItems.length > 0) {
      //check if the items in cart are from the same location than the items being added
      if (cartItems[0].storeId === order?.restaurantId) {
        //item are from the same location, ask if want to add them too

        Alert.alert(
          "Cart not empty",
          "You already have some items in cart from this location. Add these too?",
          [
            { text: "Add", onPress: addThem },
            {
              text: "Go to Cart",
              onPress: () => {
                setShowModal(false);
                navigation.navigate("Cart");
              },
            },
          ]
        );
      } else {
        //items are from different location, ask if want to remove them and add new ones.
        Alert.alert(
          "Cart not empty",
          "You have items in cart not from this location. Empty cart and add these?",
          [
            {
              text: "Add these",
              onPress: async () => {
                setAdding(true);
                await clearCart();
                addThem();
                setAdding(false);
                setShowModal(false);
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setShowModal(false);
                return;
              },
            },
          ]
        );
      }
    } else {
      addThem();
    }
  };

  // add all items to cart from selected previous order and go right to check out
  const addToCartAndCheckout = async () => {
    try {
      if (cartItems.length > 0) {
        Alert.alert(
          "Cart not empty",
          "All items in cart will be deleted and check out with these",
          [
            {
              text: "Yes Please",
              onPress: async () => {
                setAdding(true);
                await clearCart();
                await addThem();
                setAdding(false);
                setShowModal(false);
                navigation.navigate("Orders", {
                  screen: "OrderSummary",
                  params: {
                    deliveryMethod: order?.orderType,
                    paymentMethod: order?.paymentMethod,
                    customer: order?.customer,
                  },
                });
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setShowModal(false);
                return;
              },
            },
          ]
        );
      } else {
        await addThem();

        navigation.navigate("Orders", {
          screen: "OrderSummary",
          params: {
            deliveryMethod: order?.orderType,
            paymentMethod: order?.paymentMethod,
            customer: order?.customer,
          },
        });
      }
    } catch (error) {
      console.log("Error adding and checking out", error);
    }
  };

  const onChange = (e) => {
    setText(e);
    console.log(storesCopy.map((s) => s.name.includes(text)));
  };

  useEffect(() => {
    //get all stores
    getStores();
    //get all orders for a particular user if user is logged in
    getOrders(user?.id);


    return () => {
      setOrder(null);
      setRestaurant(null);
      setShowModal(false);
    };
  }, [stores.length, user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Entypo onPress={() => setOnlyLocal(preview => !preview)} style={{ marginRight: SIZES.padding * 0.5 }} name="location-pin" size={30} color={onlyLocal ? 'green' : COLORS.secondary} />
    })
  }, [navigation, onlyLocal])

  if (loading || adding) return <Loader />;

  if (stores.length === 0) {
    return (
      <Screen
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>No Stores Listed</Text>
      </Screen>
    );
  }


  if (location && onlyLocal && stores.filter(store => store.deliveryZip.includes(location[0].postalCode)).length === 0) {


    return <Screen style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ ...FONTS.body2 }}>No Stores Nearby</Text>
      <Text style={{ marginTop: SIZES.padding, ...FONTS.body4 }}>Click Icon above to turn off location</Text>
    </Screen>
  }



  //check if thee is only a store active and send user to that particular store
  if (stores.length === 1) {
    navigation.replace("Home", { restaurant: stores[0] });
  }

  return (
    <Screen style={styles.screen}>
      {/* <SearchBar text={text} onChange={e => onChange(e)} /> */}

      {user && orders.length > 0 && (
        <View
          style={{
            justifyContent: "flex-start",
            width: SIZES.width,
            height: SIZES.height * 0.2,
            padding: SIZES.radius,
          }}
        >
          <Text
            style={{
              paddingLeft: 12,
              paddingBottom: 5,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Recent Orders
          </Text>

          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ height: "100%" }}
            data={orders}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RecentOrderCard
                key={item.id}
                onPress={() => modalHandler(item)}
                order={item}
              />
            )}
          />
        </View>
      )}
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <Text style={{ ...FONTS.body2, paddingLeft: 18 }}>Restaurants</Text>
      </View>
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        showsVerticalScrollIndicator={false}
        onRefresh={getStores}
        refreshing={refreshing}
        data={location && onlyLocal ? stores.filter(store => store.deliveryZip.includes(location[0].postalCode)) : stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)]
          const opacityRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)]
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
          })
          const opacity = scrollY.interpolate({
            inputRange: opacityRange,
            outputRange: [1, 1, 1, 0]
          })
          return <StoreCard scale={scale} opacity={opacity} style={{ transform: [{ scale }] }} store={item} onPress={() => fetchStores(item)} />;

        }}
      />

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
      >
        <View style={styles.modal}>
          <TouchableOpacity
            style={{
              top: 5,
              left: 20,
              width: 30,
              height: 30,
              elevation: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setShowModal(false)}
          >
            <AntDesign name="close" size={28} color="black" />
          </TouchableOpacity>
          {/* express add order */}
          <View style={{ marginTop: 20, padding: SIZES.padding }}>
            <TouchableOpacity
              onPress={addToCartAndCheckout}
              style={styles.modalItem}
            >
              <Entypo
                style={{ marginRight: SIZES.padding * 0.5 }}
                name="flash"
                size={24}
                color="black"
              />
              <View>
                <Text>Order Express</Text>
                <Text>go rigth to cart to place order</Text>
              </View>
            </TouchableOpacity>
            {/*  add order to cart*/}

            <TouchableOpacity onPress={addItemsToCart} style={styles.modalItem}>
              <Entypo
                style={{ marginRight: SIZES.padding * 0.5 }}
                name="shopping-cart"
                size={24}
                color="black"
              />
              <View>
                <Text>Add to cart</Text>
                <Text>Add items to cart and modify there</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                fetchStores(restaurant);
                setShowModal(false);
              }}
              style={styles.modalItem}
            >
              <MaterialIcons
                style={{ marginRight: SIZES.padding * 0.5 }}
                name="restaurant"
                size={24}
                color="black"
              />
              <View>
                <Text>Go to Restaurant</Text>
                <Text>View {restaurant?.name}'s menu and order from there</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: SIZES.radius * 3,
                borderColor: COLORS.lightGray,
                borderWidth: 2,
              }}
            >
              <Text style={{ paddingVertical: 15, textAlign: "center" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  modal: {
    position: "absolute",
    justifyContent: "center",
    bottom: 0,
    left: 0,
    right: 0,
    width: SIZES.width,
    height: "50%",
    backgroundColor: COLORS.ascent,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding * 1.3,
    borderBottomWidth: 0.4,
    paddingVertical: 10,
  },
});

export default Restaurants;
