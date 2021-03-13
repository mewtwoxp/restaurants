import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'

import { updateProfile } from '../../Utils/actions'


export default function ChangeDisplayNameForm({displayName, setShowModal, toastRef, setReloadUser}) {
    const [newDisplayName, setNewDisplayName] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onsubmit = async () => {
        if (!validateForm()) {
             return
        }

        setLoading(true)
        const result = await updateProfile ({displayName: newDisplayName})
        setLoading(false)

        if(!result.statusReponse) {
            setError("Error al actualizar nombre y apellido, intenta mas tarde.")
            return
        }
        
        setReloadUser(true)
        toastRef.current.show("Se han actualizado nombres y apellidos.", 3000)
        setShowModal(false)
     
    }

    const validateForm = () => {
        setError(null)

        if(isEmpty(newDisplayName)) {
            setError("Debes ingresar nombres y apellidps")
            return false
        }
        if(newDisplayName == displayName) {
            setError("Debes ingresar nombres y apellidps diferente a los actuales.")
            return false
        }

        return true
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Ingresa Nombres y Apellidos"
                containerStyle={styles.input}
                defaultValue={displayName}
                onChange={(e)  => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2"
                }}
            />
            <Button
                title="Cambiar Nombres y Apellidos"
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
