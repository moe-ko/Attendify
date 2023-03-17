import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Welcome, SignIn, SignUp, Home } from "../screens";
import { ROUTES } from "..";
import BottomTabNavigator from "./BottomNavigator";

const Stack = createStackNavigator();

const WelcomeStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
                name='Welcome'
                component={Welcome}
                options={{
                    // headerTitle: () => <Header name='Attendify' />,
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerStyle: {
                        height: 150,
                        backgroundColor: '#62ABEF',
                        elevation: 25
                    }
                }}
            />
            <Stack.Screen
                name='Sign In'
                component={SignIn}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerStyle: {
                        height: 150,
                        display: 'none',
                        backgroundColor: '#62ABEF',
                    }
                }}
            />
            <Stack.Screen
                name='Sign Up'
                component={SignUp}
                options={{
                    // headerTitle: () => <Header name='Sign Up' />,
                    headerBackTitleVisible: false,
                    headerTitleStyle: { display: 'none' },
                    headerStyle: {
                        backgroundColor: '#ECF0F3',
                        elevation: 25,
                    }
                }}
            />
            <Stack.Screen
                name={ROUTES.HOME}
                component={BottomTabNavigator}
                options={{
                    // headerTitle: () => <Header name='Sign Up' />,
                    headerBackTitleVisible: false,
                    headerTitleStyle: { display: 'none' },
                    headerStyle: {
                        backgroundColor: '#ECF0F3',
                        elevation: 25,
                    }
                }}
            />
        </Stack.Navigator>
    );
};
export default WelcomeStackNavigator