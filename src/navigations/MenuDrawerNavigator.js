import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomTabNavigator from './BottomNavigator';
import { ROUTES } from '..';

const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                // headerShown: false,
                drawerActiveBackgroundColor: 'red',
                drawerActiveTintColor: 'white'
            }}
        >
            <Drawer.Screen name={ROUTES.HOME_DRAWER} component={BottomTabNavigator} screenOptions={{ headerShown: false }} />
            <Drawer.Screen name={ROUTES.CHART_DRAWER} component={BottomTabNavigator} screenOptions={{ headerShown: false }} />
            <Drawer.Screen name={ROUTES.PROFILE_DRAWER} component={BottomTabNavigator} screenOptions={{ headerShown: false }} />
        </Drawer.Navigator>
    )
}

export default MenuDrawerNavigator;