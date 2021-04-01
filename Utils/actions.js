import { firebaseApp } from "./firebase";
import * as firebase from 'firebase'
import 'firebase/firestore'
import { FireSQL } from 'firesql'
import * as Notifications from 'expo-notifications'
import Constans from 'expo-constants'

import { map } from "lodash";
import { fileToBlob } from "./helpers";
import { Alert } from "react-native";
import { Platform } from "react-native";

const db = firebaseApp.firestore(firebaseApp)
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        user !==null && (isLogged=true)
    })
    return isLogged
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

export const closeSession = () => {
    return firebase.auth().signOut()
}

export const registerUser = async(email, password) => {
    const result = {statusResponse: true, error: null}

    try {
        await firebaseApp.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse= false
        result.error= "Este correo ya ha sido registrado"
    }

    return result
}
export const loginWithEmailAndPassword = async(email, password) => {
    const result = {statusResponse: true, error: null}

    try {
        await firebaseApp.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse= false
        result.error= "Usuario o contrasena no valido"
    }

    return result
}

export const uploadImage = async (image, path, name) => {
    const result = { statusReponse: false, error: null, url: null }
    const ref = firebase.storage().ref(path).child(name)
    const blob = await fileToBlob(image)

    try {
        await ref.put(blob)
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusReponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async (data) => {
    const result = { statusReponse: true, error: null }
        try {
            await firebase.auth().currentUser.updateProfile(data)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const reAuthenticate = async (password) => {
    const result = { statusReponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

        try {
            await user.reauthenticateWithCredential(credentials)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const updateEmail = async (email) => {
    const result = { statusReponse: true, error: null }
        try {
            await firebase.auth().currentUser.updateEmail(email)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const updatePassword = async (password) => {
    const result = { statusReponse: true, error: null }
        try {
            await firebase.auth().currentUser.updatePassword(password)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const addDocumentWithoutId = async (collection, data) => {
    const result = { statusReponse: true, error: null }
        try {
            await db.collection(collection).add(data)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const getRestaurants = async(limitRestaurants) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurants)
            .get()
        if (response.docs.length > 0) {
            result.startRestaurant = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data()
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getMoreRestaurants = async(limitRestaurants, startRestaurant) => {
    const result = { statusResponse: true, error: null, restaurants: [], startRestaurant: null }
    try {
        const response = await db
            .collection("restaurants")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt)
            .limit(limitRestaurants)
            .get()
        if (response.docs.length > 0) {
            result.startRestaurant = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const restaurant = doc.data()
            restaurant.id = doc.id
            result.restaurants.push(restaurant)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getDocumentById = async (collection, id) => {
    const result = { statusReponse: true, error: null, document: null }
        try {
            const response = await db.collection(collection).doc(id).get()
            result.document = response.data()
            result.document.id = response.id
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const updateDocument = async (collection, id, data) => {
    const result = { statusReponse: true, error: null, document: null }
        try {
             await db.collection(collection).doc(id).update(data)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const getRestaurantsReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
            .collection("reviews")
            .where("idRestaurant", "==", id)
            .get()
  
            response.forEach((doc) => {
            const review = doc.data()
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getIsFavorite = async (idRestaurant) => {
    const result = { statusReponse: true, error: null, isFavorite: false }
        try {
            const response = await db.collection("favorites")
                .where("idRestaurant", "==", idRestaurant)
                .where("idUser", "==", getCurrentUser().uid)
                .get()
            result.isFavorite = response.docs.length > 0
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const removeIsFavorite = async (idRestaurant) => {
    const result = { statusReponse: true, error: null }
        try {
            const response = await db.collection("favorites")
                .where("idRestaurant", "==", idRestaurant)
                .where("idUser", "==", getCurrentUser().uid)
                .get()
            response.forEach(async(doc) => {
                const favoriteId = doc.id
                await db.collection("favorites").doc(favoriteId).delete()
            })
            } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const getFavorites = async () => {
    const result = { statusReponse: true, error: null, favorites: [] }
        try {
            const response = await db.collection("favorites")
                .where("idUser", "==", getCurrentUser().uid)
                .get()

            await Promise.all(
                map(response.docs, async(doc) => {
                    const favorite = doc.data()
                    const restaurant = await getDocumentById("restaurants", favorite.idRestaurant)
                    if (restaurant.statusReponse) {
                        result.favorites.push(restaurant.document)
                    }
                })
            )
            } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const getTopRestaurants = async (limit) => {
    const result = { statusReponse: true, error: null, restaurants: [] }
        try {
            const response = await db.collection("restaurants")
            .orderBy("rating", "desc")
            .limit(limit)
            .get()
            response.forEach((doc) => {
                const restaurant = doc.data()
                restaurant.id = doc.id
                result.restaurants.push(restaurant)
            })

        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const searchRestaurants = async (criteria) => {
    const result = { statusReponse: true, error: null, restaurants: [] }
        try {
            result.restaurants = await fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${criteria}%'`)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

export const getToken = async() => {
    if (!Constans.isDevice) {
        Alert.alert("Debes utilizar un dispositivo fisico para poder utilizar las notificaciones.")
        return
    }

    const { status : existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted"){
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    if (finalStatus !== "granted") {
        Alert.alert("Debes dar permiso para acceder a las notificaciones.")
        return
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data

    if (Platform.OS == "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C"
        })
    }
    return token
}

export const addDocumentWithId = async (collection, data, doc) => {
    const result = { statusReponse: true, error: null }
        try {
            await db.collection(collection).doc(doc).set(data)
        } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
})

export const startNotifications = (notificactionListener, responseListener) => {
    notificactionListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification)
    })
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
        console.log(notification)
    })
    return () => {
        Notifications.removeNotificationSubscription(notificactionListener)
        Notifications.removeNotificationSubscription(responseListener)
    }
} 

export  const sendPushNotification = async(message) => {
    let response = false
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    }).then(()=> response = true)
    return response
}

export const setNotificationMessage = (token, title, body, data) => {
    const message = {
        to: token,
        sound: "default",
        title: title,
        body: body,
        data: data
    }
    return message 
}

export const getUsersFavorite = async(restaurantId) => {
    const result = { statusReponse: true, error: null, users: [] }
    try {
        const response = await db.collection("favorites").where("idRestaurant", "==", restaurantId).get()
        await Promise.all(
            map(response.docs, async(doc) => {
                const favorite = doc.data()
                const user = await getDocumentById("users", favorite.idUser)
                if (user.statusReponse) {
                    result.users.push(user.document)
                }
            })
        )
    } catch (error) {
        result.statusReponse = false
        result.error = error
    }
 
    return result
}