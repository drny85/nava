// @ts-nocheck
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Modal } from "react-native";
import { StyleSheet, FlatList, Text, View, TouchableOpacity, Animated, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Entypo, EvilIcons, MaterialIcons, AntDesign } from '@expo/vector-icons'

import Loader from "../../components/Loader";
import RecentOrderCard from "../../components/RecentOrderCard";
import Screen from "../../components/Screen";
import StoreCard from "../../components/StoreCard";
import { COLORS, FONTS, SIZES } from "../../config";
import authContext from "../../context/auth/authContext";
import ordersContext from "../../context/order/orderContext";

import storesContext from "../../context/stores/storesContext";
import cartContext from "../../context/cart/cartContext";
import { Alert } from "react-native";
import itemsContext from "../../context/items/itemsContext";
import useLocation from "../../utils/useLocation";
import { ActivityIndicator } from "react-native";
import settingsContext from "../../context/settings/settingsContext";
import { getFilteredStores } from "../../utils/getFiltetredStores";
import Toogler from "../../components/Toogler";





const SPACING = SIZES.padding
const ITEM_SIZE = (SIZES.height * 0.25) + SPACING * 2


const Restaurants = ({ navigation }) => {
  const delRef = useRef()

  const scrollY = useRef(new Animated.Value(0)).current
  const { stores, getStores, loading, storesSub, ordersSubscrition } = useContext(storesContext);
  const { allItems, getAllStoresItems, loading: itemsLoading } = useContext(itemsContext);
  const { user } = useContext(authContext);
  const { setDeliveryMethod } = useContext(settingsContext)
  const [onlyLocal, setOnlyLocal] = useState(true)
  const [deliveryType, setDeliveryType] = useState('delivery')
  const [location, errorMsg] = useLocation(onlyLocal)
  const { addToCart, cartItems, clearCart, calculateCartTotal } = useContext(
    cartContext
  );
  const { orders, getOrders } = useContext(ordersContext);
  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [adding, setAdding] = useState(false);
  const [searching, setSearching] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");


  const fetchStores = (restaurant) => {
    if (!restaurant.open) {
      Alert.alert("CLOSED", "Store already closed", [
        { text: "OK", style: "cancel" },
      ]);
      return;
    }
    navigation.navigate("Home", { restaurant, deliveryType });
  };

  const handleSearchText = e => {
    setSearchText(e.nativeEvent.text)
    if (e.nativeEvent.text.length > 0) {
      setSearching(true)
      allItems.length === 0 && getAllStoresItems()
    }
    if (e.nativeEvent.text === '' || e.nativeEvent.text.length === 0) {
      setSearching(false)

    }

  }


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
        let element = order.items[index];
        if (order.coupon) {
          element.price = element.originalPrice

        }
        if (element.originalPrice) {
          delete element.originalPrice
        }

        await addToCart(element);
        calculateCartTotal(order.items);
      }
      setShowModal(false);
      setAdding(false);
      navigation.navigate("CartTab");
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
                navigation.navigate("CartTab");
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
                navigation.navigate("CartTab", {
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
        setShowModal(false)
        navigation.navigate("CartTab", {
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

  const handleDeliveryType = type => {
    switch (type) {
      case 'delivery':

        if (cartItems.length > 0) {
          const storeId = cartItems[0].storeId
          const res = stores.find(store => store.id === storeId)
          if (res.deliveryType === 'pickupOnly') {
            alert('You already have an item which store only offers pick ups. Please remove item to continue')
            return;
          }

        }

        setDeliveryType('delivery')
        setDeliveryMethod('delivery')

        break;


      case 'pickup':


        if (cartItems.length > 0) {
          const storeId = cartItems[0].storeId
          const res = stores.find(store => store.id === storeId)
          if (res.deliveryType === 'deliveryOnly') {
            alert('You already have an item which store only offers deliveries. Please remove item to continue')
            return;
          }

        }

        setDeliveryType('pickup')
        setDeliveryMethod('pickup')


      default:
        break;
    }
  }


  useEffect(() => {

    if (stores?.length === 1) {
      navigation.navigate("Home", { restaurant: stores[0] });
    }

    //get all stores
    getStores()
    getOrders(user?.id)
    //get all orders for a particular user if user is logged in
    setDeliveryMethod(deliveryType)

    return () => {

      setOrder(null);
      setRestaurant(null);
      setShowModal(false);
      setSearching(false)
      setSearchText('')
      storesSub && storesSub()
      ordersSubscrition && ordersSubscrition()
    };
  }, [stores.length, user?.id])


  if (stores.length === 0 && !loading) {
    return (
      <Screen
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>No Stores Listed</Text>
      </Screen>
    );
  }


  if (location && onlyLocal && stores.filter(store => store.deliveryZip && store.deliveryZip.includes(location[0].postalCode)).length === 0 && !loading) {


    return <Screen style={{ alignItems: 'center', justifyContent: 'center', flex: 1, height: SIZES.height }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flexDirection: 'row', width: SIZES.width * 0.95, justifyContent: 'space-between', alignItems: 'center', position: 'absolute', left: 0, right: 0, top: SIZES.statusBarHeight }}>

          <TextInput placeholder='What are you craving for?'
            onChange={handleSearchText}
            enablesReturnKeyAutomatically={true}
            value={searchText}
            //onSubmitEditing={filterRestaurantBySearchItem}
            returnKeyType='search'
            style={{ backgroundColor: COLORS.white, paddingHorizontal: SIZES.padding, paddingVertical: SIZES.padding * 0.5, width: '90%', borderRadius: SIZES.padding, ...FONTS.body3, borderColor: COLORS.lightGray, borderWidth: 0.5 }}
            placeholderTextColor={COLORS.black} />
          {searching ? (<TouchableOpacity onPress={() => {
            setSearching(false)
            setSearchText('')

            Keyboard.dismiss()

          }} style={{ marginRight: 10, }}>
            <AntDesign name="closecircleo" size={24} color="black" />
          </TouchableOpacity>) : (<EvilIcons onPress={() => setOnlyLocal(preview => !preview)} style={{ width: '10%', marginHorizontal: 5 }} name="location" size={30} color={onlyLocal ? 'green' : COLORS.secondary} />)}

        </View>
        <Text style={{ ...FONTS.body2 }}>No Stores Nearby</Text>
        <Text style={{ marginTop: SIZES.padding, ...FONTS.body4 }}>Click Icon above to turn off location</Text>
      </TouchableWithoutFeedback>
    </Screen>
  }



  //check if thee is only a store active and send user to that particular store

  if (loading || adding) return <Loader />;

  return (
    <Screen style={styles.screen}>
      {/* <SearchBar text={text} onChange={e => onChange(e)} /> */}

      <View style={{ flexDirection: 'row', width: SIZES.width * 0.95, justifyContent: 'space-between', alignItems: 'center', }}>

        <TextInput placeholder='What are you craving for?'
          onChange={handleSearchText}
          enablesReturnKeyAutomatically={true}
          value={searchText}
          //onSubmitEditing={filterRestaurantBySearchItem}
          returnKeyType='search'
          style={{ backgroundColor: COLORS.white, paddingHorizontal: SIZES.padding, paddingVertical: SIZES.padding * 0.5, width: '90%', borderRadius: SIZES.padding, ...FONTS.body3, borderColor: COLORS.lightGray, borderWidth: 0.5 }}
          placeholderTextColor={COLORS.black} />
        {searching ? (<TouchableOpacity onPress={() => {
          setSearching(false)
          setSearchText('')

          Keyboard.dismiss()

        }} style={{ marginRight: 10, }}>
          <AntDesign name="closecircleo" size={24} color="black" />
        </TouchableOpacity>) : (<EvilIcons onPress={() => setOnlyLocal(preview => !preview)} style={{ width: '10%', marginHorizontal: 5 }} name="location" size={30} color={onlyLocal ? 'green' : COLORS.secondary} />)}

      </View>
      {onlyLocal && (
        <View>
          <Text style={{ paddingVertical: 5, fontFamily: 'montserrat', fontSize: 12, }}>showing based on location...</Text>
        </View>
      )}

      <Toogler leftCondition='delivery' rightCondition='pickup' condition={deliveryType} onPressLeft={() => handleDeliveryType('delivery')} onPressRight={() => handleDeliveryType('pickup')} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
          {user && orders.length > 0 && (

            <View
              style={{
                justifyContent: "flex-start",
                width: SIZES.width,
                padding: SIZES.radius,
              }}
            >
              <Text
                style={{
                  ...FONTS.body4, paddingLeft: SIZES.padding * 0.5, paddingBottom: SIZES.padding * 0.2,
                }}
              >
                My Recent Orders
          </Text>


              <FlatList
                showsHorizontalScrollIndicator={false}
                data={orders}
                horizontal
                style={{ flexGrow: 0 }}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: SIZES.width, }}>


              <Text style={{
                ...FONTS.body3, paddingLeft: SIZES.padding,
              }}>Restaurants</Text>
            </View>

          </View>
          {getFilteredStores(stores, allItems, location, searchText, searching, deliveryType, onlyLocal).length === 0 && searching && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
              <Text style={{ ...FONTS.body3 }}>No stores found. </Text>
              <Text style={{ ...FONTS.body4, margin: SIZES.padding }}>Please modify your search</Text>
              <TouchableOpacity onPress={() => getAllStoresItems()}>
                {itemsLoading ? <ActivityIndicator size='large' /> : (<Text style={{ color: 'blue', padding: SIZES.padding, fontWeight: '600' }}>Refresh</Text>)}

              </TouchableOpacity>
            </View>
          )

          }
          <Animated.FlatList
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            showsVerticalScrollIndicator={false}
            onRefresh={getStores}
            refreshing={refreshing}
            data={getFilteredStores(stores, allItems, location, searchText, searching, deliveryType, onlyLocal)}
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
        </View>
      </TouchableWithoutFeedback>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
      >
        <View style={styles.modal}>
          <TouchableOpacity
            style={{
              top: 15,
              left: 20,
              width: 30,
              height: 30,
              elevation: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setShowModal(false)}
          >
            <AntDesign name="close" size={28} color={COLORS.secondary} />
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
                color={COLORS.secondary}
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
                color={COLORS.secondary}
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
                color={COLORS.secondary}
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
                borderColor: COLORS.light,
                borderWidth: 2,
              }}
            >
              <Text style={{ paddingVertical: 15, textAlign: "center", ...FONTS.h4 }}>
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

  },
  modal: {
    position: "absolute",
    justifyContent: "center",
    bottom: 0,
    left: 0,
    right: 0,
    width: SIZES.width,
    height: "60%",
    backgroundColor: COLORS.lightGray,
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
