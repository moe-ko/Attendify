import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../../../config'
import tailwind from '../../constants/tailwind'

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    signInUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'Ok' },
            ]);
        }
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView behavior={'position'}>
                <View className={`${tailwind.containerWrapper}`}>
                    <View className={`${tailwind.container}`}>
                        <View className={`${tailwind.title}`}>
                            <Text className={`${tailwind.titleText}`}>Sign In</Text>
                        </View>
                        <View className={`${tailwind.viewWrapper}`}>
                            <TextInput
                                className={`${tailwind.inputs}`}
                                value={email}
                                placeholder={'Employee ID'}
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
                            <Text onPress={() => { navigation.navigate('Forgotpassword') }} className={`${tailwind.blueTextLink}`}>Forgot Password?</Text>
                        </View>
                        <View className={`${tailwind.viewWrapper}`}>
                            <TouchableOpacity
                                className={`${tailwind.buttonBlue}`}
                                onPress={() => { signInUser('test@test.com', '123456') }}
                            // onPress={() => { signInUser(email, password) }}
                            // disabled={(!email.trim() || !password.trim())}
                            >
                                <Text className={`${tailwind.buttonWhiteText}`}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View className={`${tailwind.viewWrapper} bottom-0 flex-row justify-center`}>
                            <Text className={`text-right`}>New User? </Text>
                            <TouchableOpacity onPress={() => { navigation.navigate('Sign Up') }}>
                                <Text className={`${tailwind.blueTextLink}`} > Sign Up here</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}
export default SignIn;
