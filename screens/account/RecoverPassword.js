import React, { useState } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import Loading from '../../components/Loading'
import { sendEmailResetPassword } from '../../Utils/actions'
import { validateEmail } from '../../Utils/helpers'

export default function RecoverPassword({ navigation }) {
    const [email, setEmail] = useState("")
    const [errorEmail, setErrorEmail] = useState(null)
    const [loading, setLoading] = useState(false)

    const validateData = () => {
        setErrorEmail(null)
        let valid = true

        if (!validateEmail(email)) {
            setErrorEmail("Debes ingresar un email valido.")
            valid = false
        }

        return valid
    }

    const onSubmit = async() => {
        if (!validateData()) {
            return
        }

        setLoading(true)
        const result = await sendEmailResetPassword(email)
        setLoading(false)

        console.log(result)
        if (!result.statusReponse) {
            Alert.alert("Error","Este correo no esta relacionado a ningun usuario.")
            return 
        }
        Alert.alert("Confirmacion","Se le ha enviado un email para cambiar la contrasena")
        navigation.navigate("account", {screen: "login"})
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Ingresa tu email..."
                containerStyle={styles.inputForm}
                onChange={(e) => setEmail(e.nativeEvent.text)}
                defaultValue={email}
                errorMessage={errorEmail}
                keyboardType="email-address"
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.icon}
                    />
                }
            />
            <Button
                title="Recuperar Contrasena"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnRecover}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Recuperando contrasena..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "90%"
    },
    btnContainer: {
        marginTop: 20,
        width: "85%",
        alignSelf: "center"
    },
    btnRecover: {
        backgroundColor: "#442484"
    },
    icon: {
        color: "#c1c1c1"
    }
})
