import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import AddRestaurantForm from '../../components/restaurants/AddRestaurantForm'
import Loading from '../../components/Loading'

export default function AddRestaurant( { navigation }) {
    const toastRef = useRef()
    const [loading, setLoading] = useState(false)
useState

    return (
        <KeyboardAwareScrollView>
            <AddRestaurantForm 
                toastRef={toastRef} 
                setLoading={setLoading}
                navigation={navigation}
            />
            <Loading isVisible={loading} text="Creando restaurante..."/>
            <Toast ref={toastRef} position="center" opacity={0.9}/> 
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({})
