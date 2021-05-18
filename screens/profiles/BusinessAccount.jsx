import React from 'react'
import { ScrollView, Platform } from 'react-native'
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
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
        try {
            console.log(values)
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <Text>Business Account</Text>
                <View style={{ width: SIZES.width * 0.8 }}>
                    <AppForm initialValues={{ name: '', owner: '', street: '', city: '', zipcode: '', phone: '', ownerPhone: '' }} onSubmit={handleSubmit} validationSchema={storeSchema}>
                        <AppFormField autoFocus={true} name='name' placeholder='Store Name' />
                        <AppFormField name='owner' placeholder='Store Owner' />
                        <AppFormField name='owner' placeholder='Store Owner' />
                        <AppFormField name='street' placeholder='Store Street Name' />
                        <AppFormField name='city' placeholder='City' />
                        <AppFormField name='zipcode' keyboardType="numeric" placeholder='Zip Code' />
                        <AppFormField name='phone' placeholder='Store Phone #' />
                        <AppFormField name='ownerPhone' placeholder='Owner Phone #' />
                        <AppFormField name='email' keyboardType="email-address" placeholder='Email Address' />


                        <AppSubmitButton style={{ marginTop: 30, }} title='Submit Application' />

                    </AppForm>
                </View>
            </KeyboardAvoidingView>
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
