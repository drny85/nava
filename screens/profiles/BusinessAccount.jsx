import React from 'react'
import { ScrollView } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import AppForm from '../../components/AppForm'
import AppFormField from '../../components/AppFormField'
import { SIZES } from '../../config'

import * as Yup from 'yup'
import AppSubmitButton from '../../components/AppSubmitButton'


const storeSchema = Yup.object().shape({
    name: Yup.string().required().label('Store Name'),
    owner: Yup.string().required().label('Store Owner'),

})

const BusinessAccount = () => {

    const handleSubmit = async values => {

    }
    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text>Business Account</Text>
                <View style={{ width: SIZES.width * 0.8 }}>
                    <AppForm initialValues={{ name: '', owner: '' }} onSubmit={handleSubmit} validationSchema={storeSchema}>
                        <AppFormField name='name' placeholder='Store Name' />
                        <AppFormField name='owner' placeholder='Store Owner' />

                        <AppSubmitButton title='Submit Application' />

                    </AppForm>
                </View>
            </View>
        </ScrollView>
    )
}

export default BusinessAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.statusBarHeight,

    }

})
