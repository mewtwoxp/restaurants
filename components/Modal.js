import React from 'react'
import { StyleSheet } from 'react-native'
import { Overlay } from 'react-native-elements'

export default function Modal({isVisible, SetVisible, children}) {
    return (
        <Overlay
        isVisible={isVisible}
        overlayStyle={styles.overlay}
        onBackdropPress={() => SetVisible(false)}
        >
            {
                children
            }
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
     width: "90%"   
    }
})
