import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../../config'

const SignIn = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    signInUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <View>
            <TextInput
                value={email}
                placeholder={'Username'}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                required
            />
            <TextInput
                value={password}
                placeholder={'Password'}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                autoCorrect={false}
                required
            />
            <TouchableOpacity onPress={() => { signInUser(email, password) }} disabled={(!email.trim() || !password.trim())}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Sign Up') }}>
                <Text>SignUp</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignIn