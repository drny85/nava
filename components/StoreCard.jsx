import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';
import colors from '../config/colors'


const StoreCard = ({ store, onPress }) => {

    const { name, phone, street, city, zipcode } = store;
    return (
        <TouchableOpacity style={styles.view} onPress={onPress}>
            <Image resizeMode='cover' style={styles.img} source={{ uri: 'https://mk0tarestaurant7omoy.kinstacdn.com/wp-content/uploads/2018/01/premiumforrestaurants_0.jpg' }} />
            <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent', '#ecf0f1', '#95a5a6', '#2c3e50', '#0f0f0f']} style={styles.details}>


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
        backgroundColor: colors.tile,
        borderRadius: 15,
        elevation: 10,
        shadowColor: 'gray',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    img: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 15,
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

        fontSize: 28,
        fontFamily: 'montserrat-bold',
        textTransform: 'capitalize',
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
