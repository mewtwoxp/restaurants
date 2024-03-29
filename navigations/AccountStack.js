import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Account from '../screens/account/Account'
import Login from '../screens/account/Login'
import Register from '../screens/account/Register'
import RecoverPassword from '../screens/account/RecoverPassword'

const Stack = createStackNavigator()


export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="account"
                component={Account}
                options={{ title: "Cuentas"}}
            />
            <Stack.Screen
                name="login"
                component={Login}
                options={{ title: "Iniciar sesion"}}
            />
            <Stack.Screen
                name="register"
                component={Register}
                options={{ title: "Registrar usuario"}}
            />
            <Stack.Screen
                name="recover-password"
                component={RecoverPassword}
                options={{ title: "Recuperar Contrasena"}}
            />
        </Stack.Navigator>
)
}
