import React, { useState} from 'react'
import { Button, Icon, Input } from 'react-native-elements'
import { StyleSheet, View, Platform, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash'

import * as GoogleSignIn from 'expo-google-sign-in'
import * as firebase from 'firebase'

import { validateEmail } from '../../Utils/helpers'
import { loginWithEmailAndPassword } from '../../Utils/actions'
import Loading from '../Loading'


export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    async function googleSignInAsync() {
        try {
            await GoogleSignIn.initAsync()
            if (Platform.os == "android"){
                await GoogleSignIn.askForPlayServicesAsync()
            }
            const { type, user } = await GoogleSignIn.signInAsync()
            if (type == "success") {
                onSignIn(user)
                setLoading(false)
                return true
            } else {
                setLoading(false)
                Alert.alert(JSON.stringify(result))
                return { cancelled: true }
            }
        } catch (error) {
            setLoading(false)
            Alert.alert(error.message)
            return { error: true}
        }
    }

    function onSignIn(googleUser) {
        const unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe()
            if (!isUserEqual(googleUser, firebaseUser)) {
                const credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.auth.idToken,
                    googleUser.auth.accessToken
                )
                setLoading(true)
                firebase.auth().signInWithCredential(credential).then(() => {
                    setLoading(false)
                })
                .catch(function (error) {
                    setLoading(false)
                    Alert.alert(error.message)
                })
            } else {
                Alert.alert("Usuario ya esta logueado")
            }
        })
    }

    function isUserEqual (googleUser, firebaseUser) {
        if (firebaseUser) {
            let providerData = firebaseUser.providerData
            for (let i = 0; i < providerData.length; i++) {
                if (providerData[i] === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                        return true
                    }
            }
        }
        return true
    }

    const doLogin = async () => {
        if (!validateData()) {
            return
        }


        setLoading(true)
        const result = await loginWithEmailAndPassword(formData.email, formData.password)
        setLoading(false)

        if (!result.statusResponse) {
            setErrorEmail(result.error)
            setErrorPassword(result.error)
            return
        }

        navigation.navigate("account")

    }

    const validateData = () => {
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if(!validateEmail(formData.email)) {
            setErrorEmail("Debes de ingresar un email valido.")
            isValid = false
        }

        if (isEmpty(formData.password)) {
            setErrorPassword("Debes ingresar tu contrasena")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.container}>
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
            <Button
                title="Iniciar Sesion"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress ={() => doLogin()}
            />
            <Button
                title="Iniciar Sesion con Google"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btnGoogle}
                icon={
                    <Icon
                        name="google"
                        type="material-community"
                        marginRight= {10}
                        size={20}
                        color="#fff"
                    />
                }
                onPress ={googleSignInAsync}
            />
            <Loading isVisible={loading} text="Creando cuenta..."/>

        </View>
    )
                }
    const defaultFormValues = () => {
        return { email: "", password: ""}
    
    }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
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
    },
    btnGoogle: {
        backgroundColor: "#EA4325"
    }
})
