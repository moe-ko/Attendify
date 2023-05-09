
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, } from "../screens";
// import Event from "../screens/home/CurrentEvent";
import Icon from 'react-native-vector-icons/Ionicons'
import Chart from "../screens/home/Admin/Chart";
import { COLORS, ROUTES } from "..";
import EmployeesNavigator from "./EmployeesNavigator";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getPermission } from "../../functions";
import { firebase } from '../../config'
import ProfileHeader from "./headers/ProfileHeader";
import ReportHeader from "./headers/ReportHeader";
import DashboardHeader from "./headers/DashboardHeader";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const [permission, setPermission] = useState()
    const navigation = useNavigation()

    useEffect(() => {
        getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
    }, [permission])

    const iconName = (route, focused) => {
        let iconName = '';
        switch (route.name) {
            case ROUTES.HOME_TAB:
                iconName = 'ios-home-sharp'
                break;
            case ROUTES.PROFILE:
                iconName = 'person-circle-sharp'
                break;
            case ROUTES.CHART:
                iconName = 'stats-chart'
                break;
            case ROUTES.EMPLOYEES_NAVIGATOR:
                iconName = 'people'
                break;
        }
        return iconName
    }

    const screenOptions = (route) => {
        return {
            headerShown: false,
            tabBarShowLabel: true,
            tabBarInactiveTintColor: COLORS.lightGrey,
            tabBarActiveTintColor: COLORS.primary,
            tabBarIcon: ({ color, focused }) => { return <Icon name={iconName(route, focused)} size={30} color={color} /> },
            // headerRight: () => {
            //     return (
            //         <TouchableOpacity onPress={() => navigation.openDrawer()}>
            //             <Icon name={'ios-menu'} size={30} color={COLORS.primary} style={{ marginRight: 10 }} />
            //         </TouchableOpacity>
            //     )
            // }
            tabBarStyle: {
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 10.0,
                elevation: 24,
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                backgroundColor: '#fff',
                position: 'absolute',
                bottom: 0,
                padding: 10,
                width: '100%',
                height: 84,
                zIndex: 0,
            },
        }
    }


    return (
        <Tab.Navigator screenOptions={({ route }) => (screenOptions(route))} >
            <Tab.Screen name={ROUTES.HOME_TAB} component={DashboardHeader} options={{ title: 'Dashboard' }} />
            {permission == 'Admin' || permission == 'Super Admin' ? (
                <Tab.Screen name={ROUTES.CHART} component={ReportHeader} options={{ title: 'Report' }} />
            ) : null}
            <Tab.Screen name={ROUTES.PROFILE} component={ProfileHeader} options={{ title: `Profile` }} />
            <Tab.Screen name={ROUTES.EMPLOYEES_NAVIGATOR} component={EmployeesNavigator} options={{ title: 'Employees' }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;