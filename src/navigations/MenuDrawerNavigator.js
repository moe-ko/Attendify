import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Home, Profile } from '..';
import BottomTabNavigator from './BottomNavigator';

const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name='HomeBottom' component={BottomTabNavigator} />
            <Drawer.Screen name='HomeDrawer' component={Home} />
            <Drawer.Screen name='ProfileDrawer' component={Profile} />
        </Drawer.Navigator>
    )
}

export default MenuDrawerNavigator;