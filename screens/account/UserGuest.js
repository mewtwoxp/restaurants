import React from 'react'
import { Button } from 'react-native-elements'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'

export default function UserGuest() {
    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require("../../assets/restaurant-logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>
                Consulta tu perfil en Restaurants</Text>
                <Text style={styles.descripcion}>
                Como describirias tu mejor restaurante? Busca y visualiza los mejores restaurantes de una forma
                sencilla, vota cual te ha gustado mas y comenta como ha sido tu experiencia.
            </Text>
            <Button
            buttonStyle={styles.button}
            title="Ver tu perfil"
            onPress = {() => console.log("Click")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginHorizontal: 30
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 10,
        textAlign: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginVertical: 10,
        textAlign: "center"
    },
    descripcion: {
        textAlign: "justify",
        marginBottom: 20,
        color: "#a65273"
    },
    button: {
        backgroundColor: "#442484"
    }

})
