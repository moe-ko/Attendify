import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomTabNavigator from './BottomNavigator';
import { COLORS, ROUTES } from '..';
import Icon from 'react-native-vector-icons/Ionicons'
import CustomDrawerComponent from '../../components/CustomDrawerComponent';

const Drawer = createDrawerNavigator();

const MenuDrawerNavigator = ({ nav }) => {
    const drawerIcon = (icon) => {
        return {
            drawerIcon: ({ focused, color }) => (
                <Icon name={icon} size={18} color={color} />
            )
        }
    }
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerComponent {...props} />}
            screenOptions={{ headerShown: false, drawerActiveBackgroundColor: COLORS.primary, drawerActiveTintColor: 'white' }} >
            <Drawer.Screen name={ROUTES.HOME_DRAWER} component={BottomTabNavigator} options={drawerIcon('ios-home-sharp')} />
            <Drawer.Screen name={ROUTES.CHART_DRAWER} component={BottomTabNavigator} options={drawerIcon('stats-chart')} />
            <Drawer.Screen name={ROUTES.PROFILE_DRAWER} component={BottomTabNavigator} options={drawerIcon('person-circle-sharp')} />
        </Drawer.Navigator>
    )
}

export default MenuDrawerNavigator;