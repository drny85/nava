import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import Constants from "expo-constants";
import FloatingButton from './FloatingButton';
import colors from '../config/colors';
import { Feather, FontAwesome } from '@expo/vector-icons';

import call from 'react-native-phone-call';


const RestaurantInfo = ({ onPress }) => {
    const [favorite, setFavorite] = useState(false)
    const makeCall = async () => {
        try {
            await call({ number: '646-574-0089', prompt: false })
        } catch (error) {
            console.log(error)
        }
    }

    console.log(favorite)

    return (
        <View style={styles.container}>
            <View style={styles.closeBtn}>
                <FloatingButton iconName='x' onPress={onPress} />
            </View>
            <Image resizeMode='cover' style={styles.img} source={{ uri: 'https://img.texasmonthly.com/2020/04/restaurants-covid-19-coronavirus-not-reopening-salome-mcallen.jpg?auto=compress&crop=faces&fit=fit&fm=pjpg&ixlib=php-1.2.1&q=45&w=1100' }} />
            <Text style={styles.name}>Antojito</Text>
            <View style={styles.fav}>
                {favorite ? (<FontAwesome onPress={() => setFavorite(!favorite)} name="heart" size={40} color="red" />) : (<Feather onPress={() => setFavorite(!favorite)} name="heart" size={40} color="black" />)}

            </View>
            <View style={styles.details}>

                <View>
                    <Text style={styles.text}>1420 Clay Ave</Text>
                    <Text style={styles.text}>Bronx, NY 10456</Text>
                </View>

                <TouchableOpacity style={styles.btn} onPress={makeCall}>
                    <Feather name="phone" size={24} color={colors.tile} />
                    <Text style={{ marginHorizontal: 8, fontSize: 18, color: colors.tile, }}>Call Antojito</Text>


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
        position: 'relative'
    },
    closeBtn: { paddingTop: Constants.statusBarHeight, marginLeft: 20, zIndex: 3, position: 'absolute' },
    details: {
        backgroundColor: colors.tile,
        justifyContent: 'space-evenly',
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

    img: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height * 0.5,

    },
    name: {
        fontSize: 30,
        color: 'white',
        position: 'absolute',
        fontFamily: 'montserrat',
        right: 10,
        top: Dimensions.get('screen').height * 0.5 - 50,
    },
    text: {
        fontSize: 20,
        fontFamily: 'montserrat',
        padding: 5,
    }

})
