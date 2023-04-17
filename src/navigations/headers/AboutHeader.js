import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import About from '../../screens/home/About'
import BottomTabNavigator from '../BottomNavigator'
import { ROUTES } from '../..'

const Stack = createStackNavigator()

const AboutHeader = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name={ROUTES.ABOUT} component={About} />
    </Stack.Navigator>
  )
}
export default AboutHeader