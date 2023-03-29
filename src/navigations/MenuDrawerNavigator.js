import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
// import { Home, Profile } from '../screens';
import { Home, CreateEvent } from '../screens';
import BottomTabNavigator from './BottomNavigator';
import routes from '../constants/routes';
import { ROUTES } from '..';
import { NavigationContainer } from '@react-navigation/native';
import DrawerContent from '@react-navigation/drawer';
import { Profile } from '../screens';
import Event from '../screens/home/Admin/Event';
import Chart from '../screens/home/Admin/Chart';
import Icon from 'react-native-vector-icons/Ionicons'

const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = ({navigation}) => {
    console.log('here')
    return (
        <Drawer.Navigator // drawerContent={props => <DrawerContent {...props} />}
            
                screenOptions={({ route }) => ({
                
                drawerActiveBackgroundColor: '#62ABEF',
                drawerActiveTintColor: 'white',
                MenuBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (route.name == ROUTES.HOME_DRAWER) {
                        iconName = focused ? 'ios-home-sharp' : 'ios-home-outline'
                    } else if (route.name == ROUTES.PROFILE_DRAWER) {
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline'
                    } else if (route.name == ROUTES.CHART_DRAWER) {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline'
                    }
                    return <Icon name={iconName} size={22} color={color} />
                }
                
            })}
        >

            <Drawer.Screen name={ROUTES.HOME_DRAWER} onPress={() => { navigation.navigate('Home') }} component={BottomTabNavigator}  />

            <Drawer.Screen name={ROUTES.CHART_DRAWER} onPress={() => { navigation.navigate('Chart') }} component={BottomTabNavigator}  />
            <Drawer.Screen name={ROUTES.PROFILE_DRAWER} onPress={() => { navigation.navigate('Profile') }} component={BottomTabNavigator}
              
                options={{
                headerShown: true,
                headerStyle: {
                       // height: 150,
                     //   elevation: 25,
                    borderEndWidth: 0,
                     shadowColor:'#62ABEF',
                        //display: 'none',
                        backgroundColor: '#62ABEF',
                    },
                }} 
                
            />
        </Drawer.Navigator>

    )
}

export default MenuDrawerNavigator;