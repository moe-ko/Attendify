import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Employee from '../screens/home/Admin/Employee'
import Employees from '../screens/home/Admin/Employees'
import { ROUTES } from '..'

const Stack = createStackNavigator()

const EmployeesNavigator = () => {
    console.log(Stack)
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={ROUTES.EMPLOYEES}>
            <Stack.Screen name={ROUTES.EMPLOYEES} component={Employees} />
            <Stack.Screen name={ROUTES.EMPLOYEE} component={Employee} />
        </Stack.Navigator>
    )
}

export default EmployeesNavigator