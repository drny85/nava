import React from 'react'
import { StyleSheet, View } from 'react-native'


const Divider = () => {
    return (
        <View style={styles.view}>

        </View>
    )
}

export default Divider

const styles = StyleSheet.create({
    view: {
        width: '95%',
        height: 0.4,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignSelf: 'center',


        opacity: 0.4,
        elevation: 10,
        margin: 10,

    }
})
