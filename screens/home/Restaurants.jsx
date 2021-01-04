// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { StyleSheet, FlatList, Text, View } from "react-native";
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';

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



const Restaurants = ({ navigation }) => {
	const { stores, getStores, loading } = useContext(storesContext);
	const { user } = useContext(authContext)
	const { orders, getOrders } = useContext(ordersContext)
	const [showModal, setShowModal] = useState(false)



	const [refreshing, setRefreshing] = useState(false);
	const [text, setText] = useState('')

	// const { address, isloading } = useLocation()
	// console.log(address)

	const fetchStores = (restaurant) => {

		navigation.navigate("Home", { restaurant });
	};

	//handle modal press
	const modalHandler = (order) => {
		setShowModal(true)
		console.log('Modal:', order)
	}



	const onChange = e => {
		setText(e)
		console.log(storesCopy.map(s => s.name.includes(text)))
	}

	useEffect(() => {
		getStores();
		getOrders(user?.id)

		return () => {

		};
	}, [stores.length, user]);


	if (loading) return <Loader />;

	if (stores.length === 0) {
		return <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>No Stores Listed</Text>
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
				<View style={{ justifyContent: 'flex-start', width: SIZES.width, height: SIZES.height * 0.20, padding: SIZES.radius }}>
					<Text style={{ paddingLeft: 12, paddingBottom: 5, fontWeight: '600', fontSize: 16 }}>Recent Orders</Text>

					<FlatList showsHorizontalScrollIndicator={false} data={orders} horizontal keyExtractor={item => item.id} renderItem={({ item }) => <RecentOrderCard key={item.id} onPress={() => modalHandler(item)} order={item} />} />
				</View>
			)}
			<FlatList

				onRefresh={getStores}
				refreshing={refreshing}
				data={stores}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {

					return <StoreCard store={item} onPress={() => fetchStores(item)} />;
				}}
			/>




			<Modal visible={showModal} animationType='slide' transparent presentationStyle='overFullScreen'>
				<View style={{ position: 'absolute', justifyContent: 'center', bottom: 0, left: 0, right: 0, width: SIZES.width, height: '40%', backgroundColor: COLORS.card, borderTopRightRadius: 30, borderTopLeftRadius: 30, }}>
					<TouchableOpacity style={{ top: 20, left: 20, width: 30, height: 30, elevation: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => setShowModal(false)}>
						<AntDesign name="close" size={28} color="black" />
					</TouchableOpacity>
					{/* express add order */}
					<View style={{ marginTop: 20, padding: SIZES.padding, }}>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.padding * 1.3, borderBottomWidth: 0.4, paddingVertical: 10, }}>
							<Entypo style={{ marginRight: SIZES.padding * 0.5 }} name="flash" size={24} color="black" />
							<View>
								<Text>Order Express</Text>
								<Text>go rigth to cart to place order</Text>
							</View>

						</TouchableOpacity>
						{/*  add order to cart*/}

						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.padding * 1.3, borderBottomWidth: 0.4, paddingVertical: 10, }}>
							<Entypo style={{ marginRight: SIZES.padding * 0.5 }} name="shopping-cart" size={24} color="black" />
							<View>
								<Text>Add to cart</Text>
								<Text>Add items to cart and modify there</Text>
							</View>

						</TouchableOpacity>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.padding * 1.3, }}>
							<MaterialIcons style={{ marginRight: SIZES.padding * 0.5 }} name="restaurant" size={24} color="black" />
							<View>
								<Text>Go to Restaurant</Text>
								<Text>View restaurant menu and order from there</Text>
							</View>

						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => setShowModal(false)} style={{ paddingVertical: SIZES.padding * 0.7, marginHorizontal: 20, width: SIZES.width, alignItems: 'center', justifyContent: 'center', borderRadius: SIZES.radius * 3, borderColor: COLORS.lightGray, borderWidth: 2 }}>
						<Text>Cancel</Text>
					</TouchableOpacity>
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
		height: SIZES.height * 0.5,
		width: SIZES.width,
		backgroundColor: COLORS.primary



	}
});

export default Restaurants;
