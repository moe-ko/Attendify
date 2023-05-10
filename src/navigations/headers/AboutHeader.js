import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import About from '../../screens/home/About'
import BottomTabNavigator from '../BottomNavigator'
import { COLORS, ROUTES } from '../..'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'

const Stack = createStackNavigator()

const AboutHeader = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          elevation: 0,   // for Android
          shadowOffset: {
            width: 0, height: 0 // for iOS
          }
        }
      }}
    >
      <Stack.Screen name={ROUTES.ABOUT} component={About}
        options={{
          headerBackTitleVisible: true,
          headerTitleAlign: 'center',
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name={'chevron-back-circle-outline'} size={30} color={COLORS.primary} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )
          },
          headerStyle: {
            backgroundColor: 'white'
          },
          headerTintColor: "black",
          headerTitle: "About Attendify"
        }} />
    </Stack.Navigator>
  )
}
export default AboutHeader