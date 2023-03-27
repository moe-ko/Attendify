import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
// import { Home, Profile } from '../screens';
import { Home, CreateEvent } from '../screens';
import BottomTabNavigator from './BottomNavigator';
import routes from '../constants/routes';
import { ROUTES } from '..';
import { NavigationContainer } from '@react-navigation/native';
import { Profile } from '../screens';
import Event from '../screens/home/Admin/Event';
import Chart from '../screens/home/Admin/Chart';

const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = () => {
    console.log('here')
    return (
        <Drawer.Navigator
            screenOptions={{
                // headerShown: false,
                drawerActiveBackgroundColor: 'red',
                drawerActiveTintColor: 'white'
            }}
        >
            <Drawer.Screen name={ROUTES.HOME} component={BottomTabNavigator} screenOptions={{ headerShown: false }} />
            <Drawer.Screen name={ROUTES.CHART} component={BottomTabNavigator} screenOptions={{ headerShown: false }} />
            <Drawer.Screen name={ROUTES.PROFILE} component={BottomTabNavigator} screenOptions={{ headerShown: false }} />
            <Drawer.Screen name={ROUTES.EMPLOYEES} component={BottomTabNavigator} screenOptions={{ headerShown: false }} />
        </Drawer.Navigator>

    )
}

export default MenuDrawerNavigator;