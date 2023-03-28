
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, } from "../screens";
// import Event from "../screens/home/CurrentEvent";
import Icon from 'react-native-vector-icons/Ionicons'
import Chart from "../screens/home/Admin/Chart";
import { ROUTES } from "..";
import EmployeesNavigator from "./EmployeesNavigator";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#62ABEF',
                tabBarIcon: ({ color, focused }) => {
                    let iconName;
                    if (route.name == ROUTES.HOME_TAB) {
                        iconName = focused ? 'ios-home-sharp' : 'ios-home-outline'
                    } else if (route.name == ROUTES.PROFILE) {
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline'
                    } else if (route.name == ROUTES.CHART) {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline'
                    } else if (route.name == ROUTES.EMPLOYEES_NAVIGATOR) {
                        iconName = focused ? 'people' : 'people-outline'
                    }
                    return <Icon name={iconName} size={30} color={color} />
                }
            })}
        >
            <Tab.Screen name={ROUTES.HOME_TAB} component={Home} options={{ headerShown: false }} />
            <Tab.Screen name={ROUTES.CHART} component={Chart} options={{ headerShown: false }} />
            <Tab.Screen name={ROUTES.PROFILE} component={Profile} options={{ headerShown: false }} />
            <Tab.Screen name={ROUTES.EMPLOYEES_NAVIGATOR} component={EmployeesNavigator} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;