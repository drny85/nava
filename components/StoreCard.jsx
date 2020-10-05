import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors'


const StoreCard = ({ store, onPress }) => {

    const { name, phone, street, city, zipcode } = store;
    return (
        <TouchableOpacity style={styles.view} onPress={onPress}>
            <Image resizeMode='cover' style={styles.img} source={{ uri: 'https://mk0tarestaurant7omoy.kinstacdn.com/wp-content/uploads/2018/01/premiumforrestaurants_0.jpg' }} />
            <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent', '#95a5a6', '#2c3e50',]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={styles.details}>


            </LinearGradient>
            <View style={styles.details2}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
                <Text style={styles.caption}>{city}, {zipcode}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default StoreCard

const styles = StyleSheet.create({
    view: {
        width: Dimensions.get('screen').width * 0.9,
        height: Dimensions.get('screen').height * 0.3,

        borderRadius: 15,
        elevation: 10,
        shadowColor: 'red',
        shadowOffset: { width: 3, height: 3 },
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
        height: Dimensions.get('screen').height * 0.12,
        opacity: 0.5,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        overflow: 'hidden',


    },
    details2: {
        position: 'absolute',

        bottom: 0,
        width: '100%',
        height: Dimensions.get('screen').height * 0.12,

        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        overflow: 'hidden',


    },
    name: {

        fontSize: 22,
        fontFamily: 'montserrat-bold',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        paddingLeft: 12,

    },
    caption: {
        paddingLeft: 12,
        textTransform: 'capitalize',
        color: colors.tile,
    },
    phone: {
        paddingLeft: 12,
        textTransform: 'capitalize',
        color: colors.tile,
        fontSize: 18,
    },
})
