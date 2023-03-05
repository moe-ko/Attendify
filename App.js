import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { firebase } from './config';
// Screens
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import Header from './components/Header';
//  


const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();


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
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{
            headerTitle: () => <Header name='Attendify' />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              elevation: 25
            }
          }}
        />
        <Stack.Screen
          name='Register'
          component={Register}
          options={{
            headerTitle: () => <Header name='Attendify' />,
            headerStyle: {
              height: 150,
              backgroundColor: '#00e4d0',
              elevation: 25
            }
          }}
        />
      </Stack.Navigator>
    )
  }

  return (
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
  )
}
export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
