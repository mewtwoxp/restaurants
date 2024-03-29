import { isEmpty, size } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import { reAuthenticate, updatePassword } from '../../Utils/actions'

export default function ChangePasswordForm({ setShowModal, toastRef }) {
    const [newPassword, setNewPassword] = useState(null)   
    const [currentPassword, setCurrentPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [errorNewPassword, setErrorNewPassword] = useState(null)
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onsubmit = async () => {
        if (!validateForm()) {
             return
        }

        setLoading(true)
        const resultReauthenticate = await reAuthenticate(currentPassword)  
        if(!resultReauthenticate.statusReponse) {
            setLoading(false)
            setErrorCurrentPassword("Contrasena incorrecta.")
            return
        }

        const resultUpdatePassword = await updatePassword(newPassword)
        setLoading(false)

        if(!resultUpdatePassword.statusReponse) {
            setErrorNewPassword("Hubo un problema cambiando la contrasena, por favor intentelo mas tarde")
            return
        }

        toastRef.current.show("Se han actualizado la contrasena.", 3000)
        setShowModal(false)
     
    }

    const validateForm = () => {
        setErrorNewPassword(null)
        setErrorCurrentPassword(null)
        setErrorConfirmPassword(null)
        let isValid = true

        if(isEmpty(currentPassword)) {
            setErrorCurrentPassword("Debes ingresar tu contrasena actual.")
            isValid = false
        }
        if (size(newPassword) < 6) {
            setErrorNewPassword("Debes ingresar una contrasena de al menos 6 caracteres")
            isValid = false
        }
        if (size(confirmPassword) < 6) {
            setErrorConfirmPassword("Debes ingresar una nueva confirmacion de tu contrasena de al menos 6 caracteres")
            isValid = false
        }
        if (newPassword !== confirmPassword) {
            setErrorNewPassword("La nueva contrasena y la confirmacion no son iguales")
            setErrorConfirmPassword("La nueva contrasena y la confirmacion no son iguales")
            isValid = false
        }
        if (newPassword === currentPassword) {
            setErrorNewPassword("Debes ingresar una contrasena diferente al actual")
            setErrorCurrentPassword("Debes ingresar una contrasena diferente al actual")
            setErrorConfirmPassword("Debes ingresar una contrasena diferente al actual")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingresa tu contrasena actual..."
                containerStyle={styles.input}
                defaultValue={currentPassword}
                onChange={(e)  => setCurrentPassword(e.nativeEvent.text)}
                errorMessage={errorCurrentPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                    type= "material-community"
                    name= {showPassword ? "eye-off-outline" : "eye-outline"}
                    iconStyle= {{color: "#c2c2c2"}}
                    onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Ingresa tu nueva contrasena..."
                containerStyle={styles.input}
                defaultValue={newPassword}
                onChange={(e)  => setNewPassword(e.nativeEvent.text)}
                errorMessage={errorNewPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                    type= "material-community"
                    name= {showPassword ? "eye-off-outline" : "eye-outline"}
                    iconStyle= {{color: "#c2c2c2"}}
                    onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Ingresa tu confirmacion de nueva contrasena..."
                containerStyle={styles.input}
                defaultValue={confirmPassword}
                onChange={(e)  => setConfirmPassword(e.nativeEvent.text)}
                errorMessage={errorConfirmPassword}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                    type= "material-community"
                    name= {showPassword ? "eye-off-outline" : "eye-outline"}
                    iconStyle= {{color: "#c2c2c2"}}
                    onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button
                title="Cambiar Contrasena"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onsubmit}
                loading={loading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingVertical:10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    }
})
