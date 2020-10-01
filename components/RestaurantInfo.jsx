import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import Constants from "expo-constants";
import FloatingButton from './FloatingButton';

const RestaurantInfo = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.closeBtn}>
                <FloatingButton iconName='x' onPress={onPress} />
            </View>
            <Image resizeMode='cover' style={styles.img} source={{ uri: 'https://img.texasmonthly.com/2020/04/restaurants-covid-19-coronavirus-not-reopening-salome-mcallen.jpg?auto=compress&crop=faces&fit=fit&fm=pjpg&ixlib=php-1.2.1&q=45&w=1100' }} />
            <Text style={styles.name}>Antojito</Text>
        </View>
    )
}

export default RestaurantInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 1,
        position: 'relative'
    },
    closeBtn: { paddingTop: Constants.statusBarHeight, marginLeft: 20, zIndex: 3, position: 'absolute' },
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
    }

})
