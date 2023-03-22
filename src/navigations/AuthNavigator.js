import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Welcome, SignIn, SignUp, Home} from "../screens";
import { ROUTES } from "..";
import BottomTabNavigator from "./BottomNavigator";
import EnterOTP from "../screens/auth/EnterOTP";
import  Checkin from "../screens/auth/Checkin";

import Forgotpassword from "../screens/auth/Forgotpassword";
import ResetPassword from "../screens/auth/ResetPassword";

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
                name='Forgotpassword'
                component={Forgotpassword}
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
            <Stack.Screen
                name='Checkin'
                component={Checkin}
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
                name='EnterOTP'
                component={EnterOTP}
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
                name='ResetPassword'
                component={ResetPassword}
                
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