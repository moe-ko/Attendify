import { View, Text, TouchableOpacity } from 'react-native'
import React, { Component, useState } from 'react'
import { firebase } from '../../config'
import { useNavigation } from '@react-navigation/native'
import Geolocation from '../../components/Geolocation'

const Home = () => {
    const navigation = useNavigation()
    const [status, setStatus] = useState('');
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSignOut = () => {
        firebase.auth()
            .signOut()
            .then(() => {
                navigation.replace('Sign In')
            })
            .catch(error => alert(error.message))
    }

    getCurrentEmployee = () => {
        firebase.firestore()
            .collection('employees')
            .where('email', '==', firebase.auth().currentUser?.email)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    getStatusEmployee(documentSnapshot.data()['status_id'])
                    setEmpId(documentSnapshot.id)
                    setEmail(documentSnapshot.data()['email'])
                    setName(documentSnapshot.data()['full_name'])
                });
            });
    }
    getStatusEmployee = (status) => {
        const st = status.split('/')
        firebase.firestore()
            .collection('status')
            .doc(st[2])
            .get()
            .then(querySnapshot => {
                setStatus(querySnapshot.data()['name']);
            });

    }

    getCurrentEmployee()

    return (
        <View>
            <View><Text>Employee Id: {empId}</Text></View>
            <View><Text>Email: {email}</Text></View>
            <View><Text>User: {name}</Text></View>
            <View><Text>Status: {status}</Text></View>
            <Geolocation />
            <TouchableOpacity onPress={() => { handleSignOut() }}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>

    )
}

export default Home