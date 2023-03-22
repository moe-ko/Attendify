import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
// import { Home, Profile } from '../screens';
import {Home,  CreateEvent } from '../screens';
import BottomTabNavigator from './BottomNavigator';
import routes from '../constants/routes';
import { ROUTES } from '..';
import { NavigationContainer } from '@react-navigation/native';
import { Profile } from '../screens';
import CurrentEvent from "../screens/home/CurrentEvent";

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
            
            <Drawer.Screen name={ROUTES.HOME} component={BottomTabNavigator} screenOptions={{ headerShown:false }}/>
            
            <Drawer.Screen name={ROUTES.EVENT} component={BottomTabNavigator}  screenOptions={{ headerShown:false }}/>
            <Drawer.Screen name={ ROUTES.PROFILE} component={BottomTabNavigator} screenOptions={{ headerShown:false }}/>
        </Drawer.Navigator>

    )
}

export default MenuDrawerNavigator;