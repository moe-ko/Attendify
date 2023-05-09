import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Profile } from '../../screens'
import { ROUTES, COLORS } from '../..'
import { getPermission } from '../../../functions'
import { firebase } from '../../../config'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator()

const ProfileHeader = () => {
   const [permission, setPermission] = useState()
   const navigation = useNavigation()

   useEffect(() => {
      getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
   }, [permission])

   return (
      <Stack.Navigator
         screenOptions={{
            headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
               elevation: 0,   // for Android
               shadowOffset: {
                  width: 0, height: 0 // for iOS
               },
               backgroundColor: COLORS.primary,
               borderWidth: 0,
               borderBottomColor: 'transparent'
            },
            // headerRight: () => {
            //    return (
            //       <TouchableOpacity onPress={() => navigation.openDrawer()}>
            //          <Icon name={'ios-menu'} size={30} color={'white'} style={{ marginRight: 10 }} />
            //       </TouchableOpacity>
            //    )
            // }
         }}
      >
         <Stack.Screen name={ROUTES.PROFILE} component={Profile} options={{ title: `My Profile`, headerTitleAlign: 'center' }} />
      </Stack.Navigator>
   )
}
export default ProfileHeader