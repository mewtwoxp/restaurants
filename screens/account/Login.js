import React from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import LoginForm from '../../components/account/LoginForm'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Login() {
    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Image
                source={require("../../assets/restaurant-logo.png")}
                resizeMode="contain"
                style={styles.image}
            /> 
            <View style={styles.container}>
                <LoginForm/>
                <CreateAccount/>
            </View>
            <RecoverPassword/>
            <Divider style={styles.divider}/>
            </KeyboardAwareScrollView>
    )
}

function RecoverPassword()  {
    const navigation = useNavigation()

    return (
        <Text 
            style={styles.register}
            onPress={() => navigation.navigate("recover-password")}
        >
            Olvidaste tu contrasena?{" "}
            <Text style={styles.btnRegister}>
                Recuperala
            </Text>
        </Text>
    )
}

function CreateAccount(props) {
    const navigation = useNavigation()

    return (
        <Text 
            style={styles.register}
            onPress={() => navigation.navigate("register")}
        >
            Aun no tienes una cuenta?{" "}
            <Text style={styles.btnRegister}>
                Registrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 150,
        width: "100%",
        marginBottom: 20
    },
    container: {
        marginHorizontal: 40
    },
    divider: {
        backgroundColor: "#442484",
        margin: 40
    },
    register: {
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnRegister: {
        color: "#442484",
        fontWeight: "bold"
    }
})
