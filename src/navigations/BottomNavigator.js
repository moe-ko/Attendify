// ./navigation/TabNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, CreateEvent } from ".."
import Icon from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({

                tabBarShowLabel: false,
                tabBarActiveTintColor: '#62ABEF',
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (route.name == 'Home') {
                        iconName = focused ? 'ios-home-sharp' : 'ios-home-outline'
                    } else if (route.name == 'Profile') {
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline'
                    } else if (route.name == 'Create Event') {
                        iconName = focused ? 'person-circle-sharp' : 'person-circle-outline'
                    }

                    return <Icon name={iconName} size={22} color={color} />
                }
            })}
        >
            <Tab.Screen name="HomeTab" component={Home} />
            <Tab.Screen name="ProfileTab" component={Profile} />
            <Tab.Screen name="CreateEventTab" component={CreateEvent} />
        </Tab.Navigator >
    );
};

export default BottomTabNavigator;