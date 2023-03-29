
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, } from "../screens";
// import Event from "../screens/home/CurrentEvent";
import Icon from 'react-native-vector-icons/Ionicons'
import Chart from "../screens/home/Admin/Chart";
import { COLORS, ROUTES } from "..";
import EmployeesNavigator from "./EmployeesNavigator";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const navigation = useNavigation()

    const iconName = (route, focused) => {
        let iconName = '';
        switch (route.name) {
            case ROUTES.HOME_TAB:
                iconName = focused ? 'ios-home-sharp' : 'ios-home-outline'
                break;
            case ROUTES.PROFILE:
                iconName = focused ? 'person-circle-sharp' : 'person-circle-outline'
                break;
            case ROUTES.CHART:
                iconName = focused ? 'stats-chart' : 'stats-chart-outline'
                break;
            case ROUTES.EMPLOYEES_NAVIGATOR:
                iconName = focused ? 'people' : 'people-outline'
                break;
        }
        return iconName
    }

    const screenOptions = (route) => {
        return {
            headerShown: true,
            tabBarShowLabel: false,
            tabBarInactiveTintColor: COLORS.inactiveIcon,
            tabBarActiveTintColor: '#62ABEF',
            tabBarIcon: ({ color, focused }) => { return <Icon name={iconName(route, focused)} size={30} color={color} /> },
            headerRight: () => {
                return (
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Icon name={'ios-menu'} size={30} color={COLORS.primary} style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                )
            }
        }
    }

    return (
        <Tab.Navigator screenOptions={({ route }) => (screenOptions(route))} >
            <Tab.Screen name={ROUTES.HOME_TAB} component={Home} options={{ title: 'Dashboard' }} />
            <Tab.Screen name={ROUTES.CHART} component={Chart} options={{ title: 'Chart' }} />
            <Tab.Screen name={ROUTES.PROFILE} component={Profile} options={{ title: 'Profile' }} />
            <Tab.Screen name={ROUTES.EMPLOYEES_NAVIGATOR} component={EmployeesNavigator} options={{ title: 'Employees' }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;