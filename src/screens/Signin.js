import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../../config'

const Signin = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    signinUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <View>
            <TextInput
                // style={Styles.form_input}
                value={email}
                placeholder={'Username'}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
            />
            <TextInput
                // style={Styles.form_input}
                value={password}
                placeholder={'Password'}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                autoCorrect={false}
            />
            <TouchableOpacity onPress={() => { signinUser(email, password) }}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                <Text>Register</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Signin