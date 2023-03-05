import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { firebase } from './config';
// Screens 
import SingUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import Header from './components/Header';
import SignIn from './src/screens/SignIn';
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
          name='Sign In'
          component={SignIn}
          options={{
            headerTitle: () => <Header name='Attendify Sign In' />,
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
          component={SingUp}
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
