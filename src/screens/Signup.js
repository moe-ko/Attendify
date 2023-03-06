import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../../config'
import { useNavigation } from '@react-navigation/native'

const SignUp = () => {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    handleSignUp = (email, password) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            // .then(() => {
            //     //Once the user creation has happened successfully, we can add the currentUser into firestore
            //     //with the appropriate details.
            //     firestore().collection('employees').doc(auth().currentUser.uid)
            //         .set({
            //             fname: fname,
            //             status_id: 0,
            //             email: email,
            //             createdAt: firestore.Timestamp.fromDate(new Date()),
            //             userImg: null,
            //         })
            // })
            .then(() => { navigation.navigate('Sign In') })
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <View>
            <View>
                <TextInput
                    onChangeText={(text) => setName(text)}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View>
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    secureTextEntry={true}
                    autoCorrect={false}
                />
            </View>
            <View>
                <TextInput
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholder="Confirm Password"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    secureTextEntry={true}
                    autoCorrect={false}
                />
            </View>
            <TouchableOpacity onPress={() => { handleSignUp(email, password) }} disabled={(!email.trim() || !password.trim())}>
                <Text>Sign Up </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Sign In') }}>
                <Text>Sign In </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUp