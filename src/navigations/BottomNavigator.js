
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
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: COLORS.inactiveIcon,
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
                },
                headerRight: ({ color, size, focused }) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Icon name={'ios-menu'} size={30} color={COLORS.primary} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                    )
                }

            })}
        >
            <Tab.Screen name={ROUTES.HOME_TAB} component={Home} />
            <Tab.Screen name={ROUTES.CHART} component={Chart} />
            <Tab.Screen name={ROUTES.PROFILE} component={Profile} />
            <Tab.Screen name={ROUTES.EMPLOYEES_NAVIGATOR} component={EmployeesNavigator} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;