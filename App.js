import React, { useEffect, useRef } from 'react'
import { LogBox } from 'react-native'
import Navigation from './navigations/Navigation'

import { startNotifications } from './Utils/actions'

LogBox.ignoreAllLogs()

export default function App() {
  const notificactionListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    startNotifications(notificactionListener, responseListener)
    
  }, [])

  return (
    <Navigation/>
  )
}