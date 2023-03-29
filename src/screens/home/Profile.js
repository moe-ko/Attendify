import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import Geolocation from '../../../components/Geolocation'
import { checkIpAddress } from '../../../functions'
import tailwind from '../../constants/tailwind'

const Profile = ({ navigation }) => {
    const [status, setStatus] = useState('');
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                    setPassword(documentSnapshot.data()['password'])
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
            <View className="bg-[#ECF0F3] mx-5">

                <Image
                    className="rounded-full h-20 w-20 mx-36 my-2"
                    source={{
                        uri: `${avatar}`,
                    }}

                />
            </View>

            <View className="my-2">

                <View className="justify-center items-center">
                    <Text>User: {name}</Text>
                </View>
                <View className="justify-center items-center">
                    <Text>Employee Id: {empId}</Text>
                </View>
            </View>

            <View className={`${tailwind.viewWrapper} bg-white w-11/12 rounded-xl mx-4 h-28 shadow-2xl my-10`}>
                <View className="flex-row py-2 px-2">
                    <Text>Email </Text>
                    <Text className="px-12">{email}</Text>
                </View>
                <View className="flex-row py-2 px-2">
                    <Text>Password </Text>
                    <Text className="px-14">{password}</Text>
                </View>
                <View className="flex-row py-2 px-2">
                    <Text>Unit</Text>
                    <Text className="px-14"> {unit} | {subunit}</Text>
                </View>
            </View>
            {permission == '1' ? (
                <TouchableOpacity onPress={() => { console.log('Make admin') }}>
                    <Text>Make user an admin</Text>
                </TouchableOpacity>
            ) : null}

            <View className="my-10">
                <View className={`${tailwind.viewWrapper} w-11/12 mx-4`}>
                    <TouchableOpacity
                        className={`${tailwind.buttonBlue} bg-black`}
                        onPress={() => { console.log('Link to SeeVee') }}
                    // onPress={() => { signInUser(email, password) }}
                    // disabled={(!email.trim() || !password.trim())}
                    >
                        <Text className={`${tailwind.buttonWhiteText}`}>See Vee</Text>
                    </TouchableOpacity>
                </View>

                <View className={`${tailwind.viewWrapper} w-11/12 mx-4`}>
                    <TouchableOpacity
                        className={`${tailwind.buttonBlue}`}
                        onPress={() => { console.log('Link to SeeVee') }}

                    >
                        <Text className={`${tailwind.buttonWhiteText}`}>Check Attendances</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>
    )
}

export default Profile