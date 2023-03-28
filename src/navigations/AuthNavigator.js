import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomNavigator";
import { Welcome, SignIn, SignUp, EnterOTP, Checkin, Forgotpassword, ResetPassword } from "../screens";
import { ROUTES } from "..";

const Stack = createStackNavigator();

const WelcomeStackNavigator = () => {
    const optionsHeaderWithHeight = {
        headerShown: false,
        headerBackTitleVisible: false,
        headerStyle: { height: 150, backgroundColor: '#62ABEF', elevation: 25 }
    }
    const optionsHeader = {
        headerBackTitleVisible: false,
        headerTitleStyle: { display: 'none' },
        headerStyle: { backgroundColor: '#ECF0F3', elevation: 25, }
    }
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name='Welcome' component={Welcome} options={optionsHeaderWithHeight} />
            <Stack.Screen name='Sign In' component={SignIn} options={optionsHeaderWithHeight} />
            <Stack.Screen name='Sign Up' component={SignUp} options={optionsHeader} />
            <Stack.Screen name='Forgotpassword' component={Forgotpassword} options={optionsHeader} />
            <Stack.Screen name='Checkin' component={Checkin} options={optionsHeaderWithHeight} />
            <Stack.Screen name='EnterOTP' component={EnterOTP} options={optionsHeader} />
            <Stack.Screen name='ResetPassword' component={ResetPassword} options={optionsHeader} />
            {/* HOME STACK */}
            <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};
export default WelcomeStackNavigator