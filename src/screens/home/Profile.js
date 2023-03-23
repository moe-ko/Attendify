import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import Geolocation from '../../../components/Geolocation'
import { checkIpAddress } from '../../../functions'

const Profile = ({ navigation }) => {
    const [status, setStatus] = useState('');
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [unit, setUnit] = useState('');
    const [subunit, setSubunit] = useState('');
    const [ipAddress, setIpAddress] = useState('')
    const [permission, setPermission] = useState('')
    const [avatar, setAvatar] = useState('')

    checkIpAddress().then(res => {
        setIpAddress(res)
    })

    const handleSignOut = () => {
        firebase.auth()
            .signOut()
            .then(() => {
                navigation.replace('Welcome')
            })
            .catch(error => console.log(error.message))
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
                    setPermission(documentSnapshot.data()['permission_id'])
                    setAvatar(documentSnapshot.data()['avatar'])
                });
            });
    }

    getStatusEmployee = (status_id) => {
        const status = firebase.firestore()
            .collection('status')
            .doc(status_id)
            .onSnapshot(documentSnapshot => {
                setStatus(documentSnapshot.data()['name'])
                getUnits(documentSnapshot.id)
            });
        return () => status();
    }

    getSubunits = (subunit_id) => {
        const subunit = firebase.firestore()
            .collection('subunits')
            .doc(subunit_id)
            .onSnapshot(documentSnapshot => {
                setSubunit(documentSnapshot.data()['name'])
            });
        return () => subunit();
    }

    getUnits = (unit_id) => {
        const subunit = firebase.firestore()
            .collection('units')
            .doc(unit_id)
            .onSnapshot(documentSnapshot => {
                setUnit(documentSnapshot.data()['name'])
            });
        return () => subunit();
    }

    getCurrentEmployee()



    return (
        <View>
            <View>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                    }}
                    source={{
                        uri: `${avatar}`,
                    }}

                />
            </View>
            <View><Text>User: {name}</Text></View>

            <View><Text>Employee Id: {empId}</Text></View>
            <View><Text>Email: {email}</Text></View>
            <View><Text>Unit: {unit} | {subunit}</Text></View>
            {permission == '1' ? (
                <TouchableOpacity onPress={() => { console.log('Make admin') }}>
                    <Text>Make user an admin</Text>
                </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={() => { console.log('Link to SeeVee') }}>
                <Text>SeeVee</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { handleSignOut() }}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Profile