import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { firebase } from './config';
// Navigator
import WelcomeStackNavigator from './src/navigations/AuthNavigator';
//import MenuDrawerNavigator from './src/navigations/MenuDrawerNavigator'; 
import 'react-native-gesture-handler';
import { checkConnection } from './functions';
import { Offline } from './src/screens/Offline';
import MenuDrawerNavigator from './src/navigations/MenuDrawerNavigator';
import { LogBox } from 'react-native';
import BottomTabNavigator from './src/navigations/BottomNavigator';

LogBox.ignoreAllLogs()

export default function App() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [connection, setConnection] = useState(false)



  function onAuthStateChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChange);
    return subscriber;
  }, [])

  useEffect(() => {
    checkConnection().then(res => {
      setConnection(res)
    })
  }, [])

  if (initializing) return null;

  return (
    connection ? (
      <NavigationContainer>
        {(user) ? <BottomTabNavigator /> : <WelcomeStackNavigator />}
      </NavigationContainer>
    ) : (<Offline onCheck={checkConnection} />)
  )

}

