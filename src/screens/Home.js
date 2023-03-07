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
    const [unit, setUnit] = useState('');
    const [subunit, setSubunit] = useState('');

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
                    getSubunits(documentSnapshot.data()['subunit_id'])
                    setEmpId(documentSnapshot.id)
                    setEmail(documentSnapshot.data()['email'])
                    setName(documentSnapshot.data()['full_name'])
                });
            });
    }
    getStatusEmployee = (status_id) => {
        const status = firebase.firestore()
            .collection('status')
            .doc(status_id.toString())
            .onSnapshot(documentSnapshot => {
                setStatus(documentSnapshot.data()['name'])
                getUnits(documentSnapshot.id)
            });
        return () => status();
    }

    getSubunits = (subunit_id) => {
        const subunit = firebase.firestore()
            .collection('subunits')
            .doc(subunit_id.toString())
            .onSnapshot(documentSnapshot => {
                setSubunit(documentSnapshot.data()['name'])
            });
        return () => subunit();
    }
    getUnits = (unit_id) => {
        const subunit = firebase.firestore()
            .collection('units')
            .doc(unit_id.toString())
            .onSnapshot(documentSnapshot => {
                setUnit(documentSnapshot.data()['name'])
            });
        return () => subunit();
    }

    getCurrentEmployee()

    return (
        <View>
            <View><Text>Employee Id: {empId}</Text></View>
            <View><Text>Email: {email}</Text></View>
            <View><Text>User: {name}</Text></View>
            <View><Text>Status: {status}</Text></View>
            <View><Text>Unit: {unit} | {subunit}</Text></View>
            <Geolocation />
            <TouchableOpacity onPress={() => { handleSignOut() }}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>

    )
}

export default Home