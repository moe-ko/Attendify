import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Welcome, SignIn, SignUp } from "../src/screens";
import Header from "../components/Header";

const Stack = createStackNavigator();

const WelcomeStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
                name='Welcome'
                component={Welcome}
                options={{
                    headerTitle: () => <Header name='Attendify' />,
                    headerShown:false,
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
                    headerShown:false,
                    headerBackTitleVisible: false, 
                    headerStyle: {
                        height: 150,
                        display:'none',
                        backgroundColor: '#62ABEF',
                        // elevation: 25
                    }
                }}
            />
            <Stack.Screen
                name='Sign Up'
                component={SignUp}
                options={{
                    headerTitle: () => <Header name='Sign Up' />,
                    headerBackTitleVisible: false,
                    headerStyle: {
                        height: 150,
                        backgroundColor: '#62ABEF',
                        elevation: 25,
                    }
                }}
            />
        </Stack.Navigator>
    );
};
export default WelcomeStackNavigator