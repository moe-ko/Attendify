import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
// import { Home, Profile } from '../screens';
import Home from '../screens';
import BottomTabNavigator from './BottomNavigator';
import routes from '../constants/routes';
import { ROUTES } from '..';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = () => {
    console.log('here')
    return (
        <Drawer.Navigator>
            <Drawer.Screen name={ROUTES.HOME_TAB} component={BottomTabNavigator} />
            {/* <Drawer.Screen name= component={Home} /> */}
            {/* <Drawer.Screen name='ProfileDrawer' component={Profile} /> */}
        </Drawer.Navigator>

    )
}

export default MenuDrawerNavigator;