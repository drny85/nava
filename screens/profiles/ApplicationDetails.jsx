import { removeNotificationSubscription } from "expo-notifications";

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const ApplicationDetails = ({ route, navigation }) => {

    const { id } = route.params;
    console.log(id)
    return (
        <View>
            <Text>Store Details</Text>
        </View>
    )
}

export default ApplicationDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    }
})
