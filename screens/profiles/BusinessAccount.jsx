import React, { useContext, useRef, useState } from 'react'

import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native'
import AppForm from '../../components/AppForm'
import AppFormField from '../../components/AppFormField'
import { Picker } from '@react-native-picker/picker';

import { COLORS, SIZES, STATES } from '../../config'

import * as Yup from 'yup'
import AppSubmitButton from '../../components/AppSubmitButton'
import FloatingButton from '../../components/FloatingButton';
import storesContext from '../../context/stores/storesContext';



const storeSchema = Yup.object().shape({
    name: Yup.string().required().label('Store Name'),
    owner: Yup.string().required().min(10).label('Store Owner'),
    street: Yup.string().required().label('Street'),
    city: Yup.string().required().label('City'),

    zipcode: Yup.string().required().min(5).label('Zip Code'),
    phone: Yup.string().required().min(10).label('Store Phone'),
    ownerPhone: Yup.string().required().min(10).label('Owner Phone'),
    email: Yup.string().email().required().label('Email')


})

const BusinessAccount = ({ navigation }) => {
    const zipRef = useRef()
    const { newStoreApplication } = useContext(storesContext)
    const [statePicker, setStatePicker] = useState(false)
    const [state, setState] = useState('')

    console.log(state, statePicker)

    const handleSubmit = async values => {
        try {

            if (state === '') {
                alert('State is a required field')
                return
            }
            values.state = state;
            values.status = 'pending';
            console.log(values)

            const { success, id } = await newStoreApplication(values)
            console.log(success)
            if (success && id) {
                navigation.navigate('ApplicationDetails', { id })
            }
        } catch (error) {
            console.log(error)
        }

    }

    useState(() => {

        return () => {
            setStatePicker(false)
        }
    }, [])
    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={{ flex: 1 }}>
            <KeyboardAvoidingView keyboardVerticalOffset={30} style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <Text>Business Account</Text>
                <View style={{ width: SIZES.width * 0.8 }}>
                    <AppForm initialValues={{ name: '', owner: '', street: '', city: '', zipcode: '', phone: '', ownerPhone: '', street: '', city: '', state: '', zipcode: '', phone: '', ownerPhone: '', email: '' }} onSubmit={handleSubmit} validationSchema={storeSchema}>
                        <AppFormField autoFocus={true} autoCapitalize='words' name='name' placeholder='Store Name' />
                        <AppFormField autoCapitalize='words' name='owner' placeholder='Owner Full Name' />

                        <AppFormField autoCapitalize='words' name='street' placeholder='Store Street Name' />
                        <AppFormField autoCapitalize='words' name='city' placeholder='City' />

                        <AppFormField name='state' onPressRightIcon={() => setState('')} onFocus={() => {
                            if (state === '') {
                                setStatePicker(true)
                            }
                        }} value={state} placeholder='State' />
                        <AppFormField name='zipcode' maxLength={5} keyboardType="numeric" placeholder='Zip Code' />
                        <AppFormField name='phone' maxLength={10} keyboardType="phone-pad" placeholder='Store Phone #' />
                        <AppFormField name='ownerPhone' maxLength={10} keyboardType="phone-pad" placeholder='Owner Phone #' />
                        <AppFormField autoCapitalize='none' name='email' keyboardType="email-address" placeholder='Email Address' />


                        <AppSubmitButton style={{ marginTop: 30, }} title='Submit Application' />

                    </AppForm>
                </View>
            </KeyboardAvoidingView>
            <Modal transparent={true} visible={statePicker} animationType='slide'>
                <View style={styles.modal}>
                    <FloatingButton onPress={() => {
                        setStatePicker(false)

                    }} iconName='x' style={{ margin: 20 }} />
                    <Picker selectedValue={state} onValueChange={value => setState(value)}>
                        {STATES.map(state => <Picker.Item label={state} value={state} key={state} />)}
                    </Picker>

                </View>
            </Modal>
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

    },
    modal: {
        flex: 1,
        height: '50%',
        backgroundColor: COLORS.primary,
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,



    }

})
