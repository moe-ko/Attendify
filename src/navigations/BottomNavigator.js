
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, } from "../screens";
import CurrentEvent from "../screens/home/CurrentEvent";
import Icon from 'react-native-vector-icons/Ionicons'

import { ROUTES } from "..";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#62ABEF',
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (route.name == ROUTES.HOME_TAB) {
                        iconName = focused ? 'ios-home-sharp' : 'ios-home-outline'
                    } else if (route.name == ROUTES.PROFILE_TAB) {
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline'
                    } else if (route.name == ROUTES.EVENT_TAB) {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline'
                    }
                    return <Icon name={iconName} size={22} color={color} />
                }
            })}

        >
            <Tab.Screen name={ROUTES.HOME_TAB} component={Home} />
            <Tab.Screen name={ROUTES.EVENT_TAB} component={CurrentEvent} />
            <Tab.Screen name={ROUTES.PROFILE_TAB} component={Profile} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;