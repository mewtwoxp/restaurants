import { size } from 'lodash'
import React, { useState } from 'react'
import {  StyleSheet, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

import { validateEmail } from '../../Utils/helpers'
import { addDocumentWithId, getCurrentUser, getToken, registerUser } from '../../Utils/actions'
import Loading from '../Loading'

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const doRegisterUser =  async () => {
        if (!validateData()) {
            return
        }

        setLoading(true)
        const result = await registerUser(formData.email, formData.password)

        if (!result.statusResponse) {
            setLoading(false)
            setErrorEmail(result.error)
            return
        }

        const token = await getToken()
        const resultUser = await addDocumentWithId("users", { token }, getCurrentUser().uid)
        if (!resultUser.statusResponse) {
            setLoading(false)
            return
        }


        setLoading(false)
        navigation.navigate("account")
    }

    const validateData = () => {
        setErrorEmail("")
        setErrorPassword("")
        setErrorConfirm("")
        let isValid = true

        if(!validateEmail(formData.email)) {
            setErrorEmail("Debes de ingresar un email valido.")
            isValid=false
        }

        if(size(formData.password) < 6) {
            setErrorPassword("Debes ingresar una contrasena de al menos seis caracteres")
            isValid=false
        }

        if(size(formData.confirm) < 6) {
            setErrorConfirm("Debes ingresar una confirmacion de contrasena de al menos seis caracteres")
            isValid=false
        }

        if(formData.password !== formData.confirm) {
            setErrorPassword("Contrasenas y confirmacion no coinciden")
            setErrorConfirm("Contrasenas y confirmacion no coinciden")
            isValid=false
        }
        return isValid
    }



    return (
        <View style={styles.form}>
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu email..."
                keyboardType={'email-address'}
                onChange = {(e) => onChange (e, "email")}
                errorMessage={errorEmail}
                defaultValue={formData.email}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Ingresa tu contrasena..."
                password={true}
                secureTextEntry={!showPassword}
                onChange = {(e) => onChange (e, "password")}
                errorMessage={errorPassword}
                defaultValue={formData.password}
                rightIcon={
                        <Icon
                            type="material-community"
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            iconStyle={styles.icon}
                            onPress= {() => setShowPassword(!showPassword)}
                        />}
            />
            <Input
                containerStyle={styles.input}
                placeholder="Confirma tu contrasena..."
                password={true}
                secureTextEntry={!showPassword}
                onChange = {(e) => onChange (e, "confirm")}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.icon}
                        onPress= {() => setShowPassword(!showPassword)}
                    />}
        />
            <Button
                title="Registrar Nuevo Usuario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress ={() => doRegisterUser()}
            />
            <Loading isVisible={loading} text="Creando cuenta..."/>
        </View>
    )
}
const defaultFormValues = () => {
    return { email: "", password: "", confirm: ""}
}


const styles = StyleSheet.create({
    form: {
        marginTop: 30
    },
    input: {
        width: "100%"
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    },
    btn: {
        backgroundColor: "#442484",
        borderRadius: 10
    },
    icon: {
        color: "#c1c1c1"
    }
})
