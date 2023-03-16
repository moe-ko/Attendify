import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { firebase } from './config';
// Navigator
import WelcomeStackNavigator from './navigation/StackNavigator';
import BottomTabNavigator from './navigation/BottomNavigator';

import { checkConnection } from './functions';
import { Offline } from './src/screens/Offline';

const Stack = createStackNavigator();

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
    console.log('Checking Connection')
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

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
});
