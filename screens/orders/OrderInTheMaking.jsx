import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { COLORS, FONTS, SIZES } from "../../config";
import { Text, Image } from "react-native";
import * as Animatable from 'react-native-animatable';
import FloatingButton from "../../components/FloatingButton";
import moment from 'moment'
import ordersContext from "../../context/order/orderContext";

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import useLocation from "../../utils/useLocation";
import MapViewDirections from 'react-native-maps-directions'
import Constants from 'expo-constants'
import useCustomLocation from "../../utils/useCustomLocation";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';



const OrderInTheMaking = ({ navigation, route }) => {
	const { order: orderInfo } = route.params

	const [estimated, setEstimated] = useState(0)
	const { name } = orderInfo.restaurant
	const [zoomIn, setZoomIn] = useState(0.04)
	const { orders } = useContext(ordersContext)
	const order = orders.find(o => o.id === orderInfo.id)


	const capitalize = st => {
		const n = st.toLowerCase()
		const p = n.charAt(0).toUpperCase()
		const cap = p + n.slice(1)
		return cap
	}

	const getDistance = distance => {
		const { duration } = distance
		setEstimated(duration)
	}

	useEffect(() => {
		if (order.restaurant) {
			const { estimatedDeliveryTime } = order.restaurant
			if (estimatedDeliveryTime.split('-').length === 2) {
				setEstimated(parseInt(estimatedDeliveryTime.split('-')[1]))
			} else {
				setEstimated(15)
			}

		}
	}, [])

	return (

		<View style={styles.container}>
			<View style={{ marginTop: SIZES.statusBarHeight, margin: 10, }}>
				<FloatingButton iconName='arrow-left' onPress={() => navigation.navigate('OrderDetails', { order })} />
			</View>
			<View style={styles.top}>
				<Animatable.View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
					<Animatable.Text animation='bounceInDown' duration={5000} style={{ ...FONTS.h2, marginVertical: SIZES.padding * 0.5 }}>{(order.status === 'delivered' || order.status === 'pickup') ? 'Awesome' : 'Great'} News!</Animatable.Text>
					{order.status === 'new' && (<Animatable.Text animation='fadeIn' delay={2000} style={{ ...FONTS.body3, paddingHorizontal: 10 }}> {capitalize(name)} received your order {moment(order.orderPlaced).fromNow()}</Animatable.Text>)}
					{order.status === 'in progress' && (<Animatable.Text animation='fadeIn' delay={2000} style={{ ...FONTS.body3, padding: 10, }}> {capitalize(name)} started preparing your order {order.processingOn && moment(order.processingOn).fromNow()}</Animatable.Text>)}
					<Animatable.Text animation="fadeIn" delay={2000} style={{ marginVertical: SIZES.padding * 0.8, ...FONTS.body3, paddingHorizontal: 10, }}>
						{order.status === 'new' ? 'We will start preparing your order shortly' : order.status === 'in progress' ? 'Your order will be delivered shortly' : order.status === 'delivered' ? `Your order was marked as delivered on ${moment(order.deliveredOn).format('LLL')}` : `Your order was picked up on ${moment(order.pickedOn).format('LLL')}`}</Animatable.Text>
					{order.status === 'delivered' && (<>
						<Animatable.View animation='fadeInUp' delay={3000} style={{ flexDirection: 'row' }}>
							<FontAwesome name="bicycle" size={24} color="black" />
							<Animatable.Text animation='fadeInUp' delay={3000} style={{ ...FONTS.body3, marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}>Estimated Arrival Time: {moment(order.deliveredOn).add(estimated + 5, 'minute').format('LT')}</Animatable.Text>
						</Animatable.View>

						<Animatable.Text animation='fadeInUp' delay={3000} style={{ ...FONTS.body3, marginTop: SIZES.padding }}>We hope you liked it. </Animatable.Text>


						<Animatable.Text animation='fadeInUp' delay={3000} style={{ ...FONTS.body3 }}>Thank you for doing business with us</Animatable.Text>
					</>)}

					{order.status === 'pickup' && (<Animatable.Text animation='fadeInUp' delay={2000} style={{ ...FONTS.body3, marginTop: SIZES.padding }}>We hope to see you soon!. </Animatable.Text>)}
				</Animatable.View>
				<View>

				</View>
			</View>

			<View style={{ flex: 1, height: '100%', width: '100%' }}>
				{(order.status === 'in progress' || order.status === 'new') && (
					<LottieView
						autoSize
						style={styles.making}
						loop
						resizeMode="cover"
						autoPlay
						// colorFilters={[{ keypath: "Sending Loader", color: "#6D042A" }]}
						source={require("../../assets/animations/cooking.json")}
					/>
				)}

				{(order.status === 'delivered') && (order.orderType === 'delivery') && (
					<LottieView autoPlay autoSize loop resizeMode='cover' source={require('../../assets/animations/delivery.json')} style={styles.making} />


				)}

				{(order.status === 'pickup') && (order.orderType === 'pickup') && (
					<LottieView autoPlay autoSize loop resizeMode='cover' source={require('../../assets/animations/picked.json')} style={[styles.making, { marginBottom: 40 }]} />


				)}

				{/* {origin && destination && (
					(order.status === 'picked' || order.status === 'delivered') && (order.orderType === 'delivery' || order.orderType === 'picked') && origin && (
						<MapView ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} region={{ longitudeDelta: 0.035, latitudeDelta: zoomIn, ...origin }} >
							<Marker coordinate={destination} title="Me" >
								<FontAwesome name="user" size={22} color={COLORS.secondary} />
							</Marker>
							<Marker coordinate={origin} title={capitalize(name)}>
								<Image source={require('../../assets/images/restaurant.png')} style={{ width: 24, height: 24 }} />
							</Marker>
							<MapViewDirections mode='BICYCLING' onReady={getDistance} origin={origin} destination={destination} apikey={Constants.manifest.ios.config.googleMapsApiKey} strokeWidth={3} strokeColor={COLORS.secondary} />

						</MapView>


					)
				)} */}

			</View>


		</View>


	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	top: {

		width: SIZES.width,
		backgroundColor: '#ffffff',
		height: SIZES.height * 0.4
	},
	bottom: {

		backgroundColor: 'red',
		height: SIZES.height * 0.6,
		alignItems: 'center',
		justifyContent: 'center',
		width: SIZES.width,
	},
	making: {

		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',


	},
	map: {
		width: SIZES.width,
		height: '100%',
	}
});

export default OrderInTheMaking;
