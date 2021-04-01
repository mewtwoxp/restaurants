import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native'
import { Avatar, Button, Icon, Input, Image } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter, isEmpty } from 'lodash'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'

import { getCurrentLocation, loadImageFromGallery, validateEmail } from '../../Utils/helpers'
import { addDocumentWithoutId, getCurrentUser, uploadImage } from '../../Utils/actions'
import  Modal  from '../../components/Modal'

const widthScreen = Dimensions.get("window").width

export default function AddRestaurantForm({ toastRef, setLoading, navigation}) {
    const [formData, setFormData] = useState(defaultFormValue())
    const [errorName, setErrorName] = useState(null)
    const [errorDescripcion, setErrorDescripcion] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)
    
    const addRestaurant = async() => {
        if (!validForm()) {
            return
        }

        setLoading(true)
        const responseUploadImages = await uploadImages()

        const restaurant= {
            name: formData.name,
            address: formData.address,
            descripcion: formData.descripcion,
            callingCode: formData.callingCode,
            phone: formData.phone,
            email: formData.email,
            location: locationRestaurant,
            image: responseUploadImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: getCurrentUser().uid            
        }
        const responseAddDocument = await addDocumentWithoutId("restaurants", restaurant)
        setLoading(false)

        if (!responseAddDocument.statusReponse) {
            toastRef.current.show("Error al grabar el registro, por favor intente mas tarde.", 3000)
            return 
        }

        navigation.navigate("restaurants")

    }

    const uploadImages = async() => {
        const imageUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "restaurants", uuid())
                if (response.statusReponse) {
                    imageUrl.push(response.url)
                }
            })
        )
        return imageUrl
    }

    const validForm = () => {
        clearError()
        let isValid = true

        if (isEmpty(formData.name)) {
            setErrorName("Debes ingresar el nombre del restaurante")
            isValid=false
        }
        if (isEmpty(formData.address)) {
            setErrorAddress("Debes ingresar una direccion del restaurante")
            isValid=false
        }
        if (isEmpty(formData.phone)) {
            setErrorPhone("Debes ingresar el telefono del restaurante")
            isValid=false
        }
        if (!validateEmail(formData.email)) {
            setErrorEmail("Debes ingresar un email del restaurante valido")
            isValid=false
        }
        if (isEmpty(formData.descripcion)) {
            setErrorDescripcion("Debes ingresar la descripcion del restaurante")
            isValid=false
        }
        if(!locationRestaurant) {
            toastRef.current.show("Debes localizar el restaurante en el mapa", 3000)
            isValid=false
        } else if (size(imagesSelected) ===0) {
            toastRef.current.show("Debes de agregar al menos una imagen al restaurante.", 3000)
            isValid=false
        }
        return isValid
    }

    const clearError = () => {
        setErrorName(null)
        setErrorPhone(null)
        setErrorDescripcion(null)
        setErrorAddress(null)
        setErrorEmail(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageRestaurant 
                imageRestaurant = {imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescripcion={errorDescripcion}
                errorEmail={errorEmail}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                setIsVisibleMap={setIsVisibleMap}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapRestaurant({ isVisibleMap, setIsVisibleMap, locationRestaurant, setLocationRestaurant, toastRef }) {
    const [newRegion, setNewRegion] = useState(null)

    useEffect(() => {
        (async() => {
            const response = await getCurrentLocation()
            if (response.status) {
                setLocationRestaurant(response.location)
            }
        } )()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(newRegion)
        toastRef.current.show("Localizacion guardada correctamente.",3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
            <View>
                {
                    locationRestaurant && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: locationRestaurant.latitude,
                                    longitude: locationRestaurant.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    )
                }
                <View style={styles.viewMapBtn}>
                <Button
                        title="Guardar ubicacion"
                        containerStyle={styles.viewBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                    title="Cancelar ubicacion"
                    containerStyle={styles.viewBtnContainerCancel}
                    buttonStyle={styles.viewMapBtnCancel}
                    onPress={() => setIsVisibleMap(false)}
                />
                </View>
            </View>
        </Modal>
    )
}

function ImageRestaurant({ imageRestaurant }) {
    return (
        <View style={styles.viewPhoto}>
            <Image
            style={{ width: widthScreen, height: 200 }}
                source={
                    imageRestaurant
                        ? { uri: imageRestaurant }
                        : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

const   defaultFormValue = () => {
    return {
        name: "",
        descripcion: "",
        email: "",
        phone: "",
        address: "",
        country: "CO",
        callingCode: "57"

    }
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected}) {
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4, 3])
        if (!response.status) {
            toastRef.current.show("No ha seleccionado ninguna imagen.", 3000)
            return
        }

        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
    Alert.alert(
        "Eliminar imagen",
        "Estas seguro que quieres eliminar la imagen?",
        [
            {
                text: "No",
                style: "cancel"
            },
            {
                text: "Si",
                onPress: () => {
                    setImagesSelected(
                        filter(imagesSelected, (imageUrl) => imageUrl !== image)
                    )
                }
            }
        ],
        {
            cancelable: true
        }
    )
}

    return (
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
            {
                size(imagesSelected) < 10 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    /> 
                )
            }
            {
                map(imagesSelected, (imageRestaurant, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageRestaurant }}
                        onPress={() => removeImage(imageRestaurant)}
                    />
                ))
            }
        </ScrollView>
    )
}

function FormAdd( {formData, setFormData, errorName, errorDescripcion, errorEmail, errorAddress, errorPhone, setIsVisibleMap}) {
    const [country, setCountry] = useState("CO")
    const [callingCode, setCallingCode] = useState("57")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text})
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante..."
                defaultFormValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Direccion del restaurante..."
                defaultFormValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder="Email del restaurante..."
                keyboardType="email-address"
                defaultFormValue={formData.email}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errorEmail}
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle={styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({ 
                            ...formData, 
                            "Country": country.cca2, 
                            "callingCode": country.callingCode[0]})
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0])
                    }}
                />
                <Input
                    placeholder="WhatsApp del restaurante..."
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultFormValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                    />
            </View>
                <Input
                    placeholder="Descripcion del restaurante..."
                    multiline
                    containerStyle={styles.textArea}
                    defaultFormValue={formData.descripcion}
                    onChange={(e) => onChange(e, "descripcion")}
                    errorMessage={errorDescripcion}
                    />
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm: {
        marginHorizontal: 10
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddRestaurant: {
        margin: 20,
        backgroundColor: "#442484"
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor:"#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20    
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
     viewBtnContainerCancel: {  
         paddingLeft: 5
     },
     viewBtnContainerSave: {
         paddingRight: 5
     },
     viewMapBtnCancel: {
         backgroundColor: "#a65273"
     },
     viewMapBtnSave: {
         backgroundColor: "#442484"
     }
})
