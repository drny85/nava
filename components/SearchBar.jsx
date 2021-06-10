import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { COLORS } from '../config'


const SearchBar = ({ text, onChange }) => {


    return (
        <View style={styles.view}>
            <TextInput placeholderTextColor={COLORS.text} value={text} onChangeText={onChange} style={styles.input} placeholder="What do you feel like eating today?" />
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    view: {
        width: '95%',
        margin: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',


    },
    input: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: COLORS.tile,

        borderBottomColor: COLORS.tile,
        borderWidth: 0.3,

        fontFamily: 'montserrat',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',

    },
})
