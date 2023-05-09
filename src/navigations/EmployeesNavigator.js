import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Employee from '../screens/home/Admin/Employee'
import Employees from '../screens/home/Admin/Employees'
import { COLORS, ROUTES } from '..'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator()

const EmployeesNavigator = () => {
    const navigation = useNavigation()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            headerStyle: {
                elevation: 0,   // for Android
                shadowOffset: {
                    width: 0, height: 0 // for iOS
                }
            }
        }}
            initialRouteName={ROUTES.EMPLOYEES_DRAWER}>
            <Stack.Screen name={ROUTES.EMPLOYEES} component={Employees}
                options={{
                    headerBackTitleVisible: false,
                    headerTitle: "Search Employees",
                    headerTitleAlign: 'center',
                    // headerRight: () => {
                    //     return (
                    //         <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    //             <Icon name={'ios-menu'} size={30} color={COLORS.primary} style={{ marginRight: 10 }} />
                    //         </TouchableOpacity>
                    //     )
                    // }
                }}
            />
            <Stack.Screen name={ROUTES.EMPLOYEE} component={Employee}
                options={{
                    headerBackTitleVisible: false,
                    headerStyle: {
                        elevation: 0,   // for Android
                        shadowOffset: {
                            width: 0, height: 0 // for iOS
                        },
                        backgroundColor: COLORS.primary,
                    },
                    headerLeft: () => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.EMPLOYEES)}>
                                <Icon name={'chevron-back-circle-outline'} size={30} color={COLORS.white} style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        )
                    },
                    headerTintColor: COLORS.white,
                    headerTitle: "Employee Profile"
                }}
            />
        </Stack.Navigator>
    )
}

export default EmployeesNavigator