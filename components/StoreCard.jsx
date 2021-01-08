import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'

import moment from 'moment'

import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors'
import { COLORS, FONTS, SIZES, WEEKDAYS } from '../config';



const StoreCard = ({ store, onPress }) => {

    const { name, phone, street, city, zipcode, imageUrl } = store;

    const storeClosed = () => {
        const time = new Date().toLocaleString().split(',')[1].split(':');
        const hr = parseInt(time[0])
        const min = parseInt(time[1])
        const ampm = time[2].split(' ')[1]
        const isClosed = store?.hours
        const day = WEEKDAYS[new Date().getDay()]
        const storeHr = store.hours[day]
        const storeOpenHr = parseInt(storeHr.split('a')[0])
        const storeCloseHr = parseInt(storeHr.split('-')[1].split(0))

        console.log(new Date().toLocaleString())

        if (hr >= storeOpenHr && ampm === 'AM') {
            return true
        }

        return false


    }




    return (
        <TouchableOpacity style={styles.view} onPress={onPress}>
            <Image resizeMode='cover' style={styles.img} source={{ uri: imageUrl ? imageUrl : 'https://mk0tarestaurant7omoy.kinstacdn.com/wp-content/uploads/2018/01/premiumforrestaurants_0.jpg' }} />
            <LinearGradient colors={['rgba(0,0,0,0.8)', 'black']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.details}>


            </LinearGradient>
            <View style={styles.details2}>
                <Text numberOfLines={1} style={styles.name}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
                <Text style={styles.phone}>{street}</Text>
                <Text style={styles.caption}>{city}, {zipcode}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'red', paddingLeft: 15, paddingVertical: 5, fontWeight: '700' }}>{store.open ? null : 'CLOSED'}</Text>
                    {store.estimatedDeliveryTime && <Text style={{ fontSize: 18, color: COLORS.white, textAlign: 'right', paddingRight: 20, fontWeight: '500' }}>{store.estimatedDeliveryTime} mins</Text>}
                </View>

            </View>
        </TouchableOpacity>
    )
}

export default StoreCard

const styles = StyleSheet.create({
    view: {
        width: SIZES.width * 0.9,
        height: SIZES.height * 0.25,

        borderRadius: 15,
        elevation: 10,
        shadowColor: 'red',
        shadowOffset: { width: 3, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 15,
        backgroundColor: colors.white,
        marginVertical: 8,
        overflow: 'hidden',
    },
    img: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 15,
        backgroundColor: colors.white,
    },
    details: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: SIZES.height * 0.12,
        opacity: 0.5,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        overflow: 'hidden',


    },
    details2: {
        position: 'absolute',

        bottom: 0,
        width: '100%',
        height: SIZES.height * 0.12,
        paddingTop: 8,

        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        overflow: 'hidden',




    },
    name: {

        fontSize: 16,
        fontFamily: 'montserrat-bold',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        paddingLeft: 12,
        color: colors.tile,

    },
    caption: {
        paddingLeft: 12,
        textTransform: 'capitalize',
        color: colors.tile,
        fontSize: 14,
    },
    phone: {
        paddingLeft: 12,
        textTransform: 'capitalize',
        color: colors.tile,
        fontSize: 12,
    },
})
