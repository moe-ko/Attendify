import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../../../config'
import tailwind from '../../constants/tailwind'
import { ROUTES } from '../..'


const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isValidUser = true;
    const isValidPassword = true;

    signInUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            Alert.alert('Login Failed', `${error.message = "Please provide correct login details"}`, [
                { text: 'Ok' },
            ]);
        }
    }

    return (
        <KeyboardAvoidingView>
            <View className={`${tailwind.containerWrapper}`}>
                <View className={`${tailwind.container} h-screen`}>
                    <View className={`${tailwind.title}`}>
                        <Text className={`${tailwind.titleText}`}>Sign In</Text>
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs}`}
                            value={email}
                            // placeholder={'Employee ID'}
                            // added email holder, prefer ID
                            placeholder={'Employee Email'}
                            onChangeText={(text) => setEmail(text)}
                            autoCapitalize={'none'}
                            keyboardType={'email-address'}
                            required
                        />
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs}`}
                            value={password}
                            placeholder={'Password'}
                            secureTextEntry
                            onChangeText={(text) => setPassword(text)}
                            autoCorrect={false}
                            required
                        />
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <Text onPress={() => { navigation.navigate(ROUTES.FORGOT_PASS) }} className={`${tailwind.blueTextLink}`}>Forgot Password?</Text>
                    </View>
                    <View className={`${tailwind.viewWrapper} my-3`}>
                        <TouchableOpacity
                            className={`${tailwind.buttonBlue}`}
                        onPress={() => { signInUser(email, password) }}
                        disabled={(!email.trim() || !password.trim())}
                        >
                            <Text className={`${tailwind.buttonWhiteText}`}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                    <View className={`${tailwind.viewWrapper} bottom-0 flex-row justify-center my-3`}>
                        <Text className={`text-right`}>New User? </Text>
                        <TouchableOpacity onPress={() => { navigation.navigate(ROUTES.SIGNUP) }}>
                            <Text className={`${tailwind.blueTextLink}`} > Sign Up here</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>

    )
}
export default SignIn;
