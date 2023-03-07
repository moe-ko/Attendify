import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { firebase } from './config';
// Navigator
import BottomTabNavigator from "./navigation/TabNavigator";
// Screens 
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import Header from './components/Header';
import SignIn from './src/screens/SignIn';
import { checkConnection } from './functions';
import { Offline } from './src/screens/Offline';
//  
const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [connection, setConnection] = useState(false)

  checkConnection().then(res => {
    setConnection(res)
  })

  function onAuthStateChange(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChange);
    return subscriber;
  }, [])

  if (initializing) return null;

  if (!user) {
    return (
      connection ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='Sign In'
              component={SignIn}
              options={{
                headerTitle: () => <Header name='Attendify Sign' />,
                headerBackTitleVisible: false,
                headerStyle: {
                  height: 150,
                  backgroundColor: '#62ABEF',
                  elevation: 25
                }
              }}
            />
            <Stack.Screen
              name='Sign Up'
              component={SignUp}
              options={{
                headerTitle: () => <Header name='Attendify Sign Up' />,
                headerBackTitleVisible: false,
                headerStyle: {
                  height: 150,
                  backgroundColor: '#62ABEF',
                  elevation: 25,
                }
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (<Offline onCheck={checkConnection} />)
    )
  } else {
    return (
      connection ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='Home'
              component={Home}
              options={{
                headerTitle: () => <Header name='Home' />,
                headerStyle: {
                  height: 150,
                  backgroundColor: '#00e4d0',
                  elevation: 25
                }
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (<Offline />)
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
