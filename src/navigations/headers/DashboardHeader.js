import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Home, Profile } from '../../screens'
import { ROUTES, COLORS } from '../..'
import { getPermission } from '../../../functions'
import { firebase } from '../../../config'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import Chart from '../../screens/home/Admin/Chart'


const Stack = createStackNavigator()

const DashboardHeader = () => {
  const [permission, setPermission] = useState()
  const navigation = useNavigation()

  useEffect(() => {
    getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
  }, [permission])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          elevation: 0,   // for Android
          shadowOffset: {
            width: 0, height: 0 // for iOS
          },
          backgroundColor: 'white',
        },
        // headerRight: () => {
        //   return (
        //     <TouchableOpacity onPress={() => navigation.openDrawer()}>
        //       <Icon name={'ios-menu'} size={30} color={COLORS.primary} style={{ marginRight: 10 }} />
        //     </TouchableOpacity>
        //   )
        // }
      }}
    >
      <Stack.Screen name={ROUTES.HOME} component={Home} options={{ title: `Dashboard`, headerTitleAlign: 'center' }} />
    </Stack.Navigator>
  )
}
export default DashboardHeader