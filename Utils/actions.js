import { firebaseApp } from "./firebase";
import * as firebase from 'firebase'
import 'firebase/firestore'
import { map, padStart } from "lodash";
import { fileToBlob } from "./helpers";

const db = firebaseApp.firestore(firebaseApp)

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
            
            const restaurantsId =  []
            response.forEach((doc) => {
                const favorite = doc.data()
                restaurantsId.push(favorite.idRestaurant)
            })

            await Promise.all(
                map(restaurantsId, async(restaurantId) => {
                    const response2 = await getDocumentById("restaurants", restaurantId)
                    if (response2.statusReponse) {
                        result.favorites.push(response2.document)
                    }
                })
            )
            } catch (error) {
            result.statusReponse = false
            result.error = error
        }
    return result
}

