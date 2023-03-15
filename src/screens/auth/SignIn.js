import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../../../config'

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    signInUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <View style={style.container}>
            <TextInput
                style={style.input}
                value={email}
                placeholder={'Username'}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                required
            />
            <TextInput
                style={style.input}
                value={password}
                placeholder={'Password'}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                autoCorrect={false}
                required
            />
            <TouchableOpacity
                style={style.buttonGray}
                onPress={() => { signInUser('superadmin@gmail.com', 'superadmin') }}
            // onPress={() => { signInUser(email, password) }}
            // disabled={(!email.trim() || !password.trim())}
            >
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonBlue}
                onPress={() => { navigation.navigate('Sign Up') }}>
                <Text>SignUp</Text>
            </TouchableOpacity>
        </View >
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 36,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 4,
        margin: 5
    },
    buttonGray: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 4,
        margin: 5
    },
    buttonBlue: {
        alignItems: 'center',
        backgroundColor: '#62ABEF',
        padding: 10,
        borderRadius: 4,
        margin: 5
    },
})
export default SignIn;
