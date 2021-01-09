import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import Constants from "expo-constants";
import FloatingButton from './FloatingButton';
import colors from '../config/colors';
import { Feather, FontAwesome } from '@expo/vector-icons';

import call from 'react-native-phone-call';
import { COLORS, FONTS } from '../config';
import authContext from '../context/auth/authContext';



const RestaurantInfo = ({ restaurant, onPress }) => {
    const [favorite, setFavorite] = useState(false)
    const { user, addOrRemoveFavorite } = useContext(authContext)
    const makeCall = async () => {
        try {
            await call({ number: restaurant.phone, prompt: false })
        } catch (error) {
            console.log(error)
        }
    }

    const handleFavorite = () => {
        addOrRemoveFavorite(user.id, restaurant.id)
        const fav = user?.favoriteStores.find(s => s === restaurant.id)

        if (fav) {
            setFavorite(true)
        } else {
            setFavorite(false)
        }
    }

    useEffect(() => {
        const fav = user && user.favoriteStores.find(s => s === restaurant.id)

        if (fav) {
            setFavorite(true)
        } else {
            setFavorite(false)
        }
    }, [favorite, user])

    return (
        <View style={styles.container}>
            <View style={styles.closeBtn}>
                <FloatingButton iconName='x' onPress={onPress} />
            </View>
            <Image resizeMode='cover' style={styles.img} source={{ uri: 'https://img.texasmonthly.com/2020/04/restaurants-covid-19-coronavirus-not-reopening-salome-mcallen.jpg?auto=compress&crop=faces&fit=fit&fm=pjpg&ixlib=php-1.2.1&q=45&w=1100' }} />
            <Text style={styles.name}>{restaurant.name}</Text>
            {user && (
                <View style={styles.fav}>
                    {favorite ? (<FontAwesome onPress={handleFavorite} name="heart" size={40} color="red" />) : (<Feather onPress={handleFavorite} name="heart" size={40} color="black" />)}

                </View>
            )}

            <View style={styles.details}>

                <View style={{ paddingBottom: 10 }}>
                    <Text style={styles.text}>{restaurant.street}</Text>
                    <Text style={styles.text}>{restaurant.city}, {restaurant.state} {restaurant.zipcode}</Text>
                </View>
                {restaurant.hours && (
                    <View style={styles.hours}>
                        <Text style={{ ...FONTS.body2, textDecorationLine: 'underline', textDecorationColor: COLORS.lightGray }}>Business Hours</Text>
                        <Text style={{ ...FONTS.body4 }}>Sunday: {restaurant.hours.sun}</Text>
                        <Text style={{ ...FONTS.body4 }}>Monday: {restaurant.hours.mon}</Text>
                        <Text style={{ ...FONTS.body4 }}>Tuesday: {restaurant.hours.tue}</Text>
                        <Text style={{ ...FONTS.body4 }}>Wednesday: {restaurant.hours.wed}</Text>
                        <Text style={{ ...FONTS.body4 }}>Thursday: {restaurant.hours.thu}</Text>
                        <Text style={{ ...FONTS.body4 }}>Friday: {restaurant.hours.fri}</Text>
                        <Text style={{ ...FONTS.body4 }}>Saturday: {restaurant.hours.sat}</Text>
                    </View>
                )}


                <TouchableOpacity style={styles.btn} onPress={makeCall}>
                    <Feather name="phone" size={24} color={colors.tile} />
                    <Text style={{ marginHorizontal: 8, fontSize: 18, color: colors.tile, }}>Call Restaurant</Text>


                </TouchableOpacity>
            </View>
        </View>
    )
}

export default RestaurantInfo

const styles = StyleSheet.create({
    btn: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        marginVertical: 20,
        height: 50,
        width: Dimensions.get('screen').width * 0.60,
    },
    container: {
        flex: 1,
        zIndex: 1,
        justifyContent: 'space-around',

        position: 'relative'
    },
    closeBtn: { paddingTop: Constants.statusBarHeight, marginLeft: 20, zIndex: 3, position: 'absolute' },
    details: {
        backgroundColor: colors.tile,

        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
    },
    fav: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.tile,
        padding: 20,

    },
    hours: {
        padding: 10,
    },

    img: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.45,

    },
    name: {
        fontSize: 30,
        color: 'white',
        position: 'absolute',
        fontFamily: 'montserrat',
        right: 10,
        top: Dimensions.get('screen').height * 0.45 - 50,
        textTransform: 'capitalize',
    },
    text: {
        fontSize: 18,
        fontFamily: 'montserrat',
        padding: 5,
        textTransform: 'uppercase',
    }

})
