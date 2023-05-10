import React, { useState, useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomTabNavigator from './BottomNavigator';
import { COLORS, ROUTES } from '..';
import Icon from 'react-native-vector-icons/Ionicons'
import CustomDrawerComponent from '../components/CustomDrawerComponent';
import { Home, Profile } from '../screens';
import Chart from '../screens/home/Admin/Chart';
import Employees from '../screens/home/Admin/Employees';
import { getPermission } from "../../functions";
import { firebase } from '../../config'
import AboutHeader from './headers/AboutHeader';
import { ListItem, Avatar, BottomSheet, Button } from '@rneui/base'
const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = () => {
    const [permission, setPermission] = useState()

    useEffect(() => {
        getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
    }, [permission])

    const drawerIcon = (title, icon) => {
        return {
            title: title,
            drawerIcon: ({ focused, color }) => (
                <Avatar size={40} rounded icon={{ name: icon, type: "material" }} containerStyle={{ backgroundColor: '#D0E2F2', color: COLORS.red }} />
            )
        }
    }
    const screenOptions = () => {
        return {
            headerShown: false,
            drawerActiveBackgroundColor: COLORS.white,
            drawerActiveTintColor: COLORS.primary,
            drawerLabelStyle: { marginLeft: -20 },
            drawerPosition: 'right',    //position right
            drawerType: 'front',    // now work on IOS cuzof this line need to added
            drawerStyle: {      //works on android
                // width: 225,
                // borderBottomLeftRadius: 30,
                // borderTopLeftRadius: 30
            }
        }
    }
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerComponent {...props} />} screenOptions={screenOptions()} >
            <Drawer.Screen name={ROUTES.HOME_DRAWER} component={BottomTabNavigator} options={drawerIcon('Dashboard', 'home')} />
            <Drawer.Screen name={ROUTES.ABOUT_DRAWER} component={AboutHeader} options={drawerIcon('About', 'info')} />
            {/* {permission == 'Admin' || permission == 'Super Admin' ? (
                <Drawer.Screen name={ROUTES.CHART_DRAWER} component={Chart} options={drawerIcon('Charts', 'stats-chart')} />
            ) : null}
            <Drawer.Screen name={ROUTES.PROFILE_DRAWER} component={Profile} options={drawerIcon('Profile', 'person-circle-sharp')} />
            <Drawer.Screen name={ROUTES.EMPLOYEES_DRAWER} component={Employees} options={drawerIcon('Employees', 'people')} /> */}
        </Drawer.Navigator>
    )
}

export default MenuDrawerNavigator;