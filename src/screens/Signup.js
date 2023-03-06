import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../../config'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'

const SignUp = () => {
    const navigation = useNavigation();
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    handleSignUp = (empId, email, password, name) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => { addEmployeeDetails(empId, email, name) })
            .then(() => { navigation.navigate('Sign In') })
            .catch(error => {
                console.log(error)
            });
    }

    addEmployeeDetails = (empId, email, name) => {
        firebase
            .firestore()
            .collection('employees')
            .doc(empId)
            .set({
                createdAt: format(new Date(), "dd MMMM yyyy - H:mm:ss"),
                email: email,
                full_name: name,
                status_id: `/status/1`
            })
    }

    return (
        <View>
            <View>
                <TextInput
                    onChangeText={(text) => setEmpId(text)}
                    placeholder="Employee ID"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
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
            <TouchableOpacity onPress={() => { handleSignUp(empId, email, password, name) }} disabled={(!email.trim() || !password.trim())}>
                <Text>Sign Up </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Sign In') }}>
                <Text>Sign In </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignUp