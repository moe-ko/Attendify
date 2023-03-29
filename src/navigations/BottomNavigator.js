
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, } from "../screens";
// import Event from "../screens/home/CurrentEvent";
import Icon from 'react-native-vector-icons/Ionicons'
import Chart from "../screens/home/Admin/Chart";
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
                    } else if (route.name == ROUTES.CHART_TAB) {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline'
                    }
                    return <Icon name={iconName} size={22} color={color} />
                }
            })}

        >
            <Tab.Screen name={ROUTES.HOME_TAB} component={Home} options={{ headerShown: false }} />
            <Tab.Screen name={ROUTES.CHART_TAB} component={Chart} options={{ headerShown: false }} />
            <Tab.Screen name={ROUTES.PROFILE_TAB} component={Profile}
                options={{
                    headerShown: false,


                }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;