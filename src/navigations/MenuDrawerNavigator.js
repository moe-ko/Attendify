import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomTabNavigator from './BottomNavigator';
import { COLORS, ROUTES } from '..';
import Icon from 'react-native-vector-icons/Ionicons'
import CustomDrawerComponent from '../components/CustomDrawerComponent';
import { Home, Profile } from '../screens';
import Chart from '../screens/home/Admin/Chart';
import Employees from '../screens/home/Admin/Employees';

const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = () => {
    const drawerIcon = (title, icon) => {
        return {
            title: title,
            drawerIcon: ({ focused, color }) => (
                <Icon name={icon} size={18} color={color} />
            )
        }
    }
    const screenOptions = () => {
        return {
            headerShown: false,
            drawerActiveBackgroundColor: COLORS.primary,
            drawerActiveTintColor: 'white',
            drawerLabelStyle: { marginLeft: -20 }
        }
    }
    return (


        <Drawer.Navigator drawerContent={props => <CustomDrawerComponent {...props} />} screenOptions={screenOptions()} >
            <Drawer.Screen name={ROUTES.HOME_DRAWER} component={BottomTabNavigator} options={drawerIcon('Dashboard', 'ios-home-sharp')} />
            <Drawer.Screen name={ROUTES.CHART_DRAWER} component={Chart} options={drawerIcon('Charts', 'stats-chart')} />
            <Drawer.Screen name={ROUTES.PROFILE_DRAWER} component={Profile} options={drawerIcon('Profile', 'person-circle-sharp')} />
            <Drawer.Screen name={ROUTES.EMPLOYEES_DRAWER} component={Employees} options={drawerIcon('Employees', 'people')} />
        </Drawer.Navigator>
    )
}

export default MenuDrawerNavigator;