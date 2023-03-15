import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import Geolocation from '../../../components/Geolocation'
import { checkIpAddress } from '../../../functions'
import CreateEvent from './Admin/CreateEvent'
import CurrentEvent from './CurrentEvent'

const Home = ({ navigation }) => {
    const [ipAddress, setIpAddress] = useState('')
    const [permission, setPermission] = useState('')
    const [empId, setEmpId] = useState('')


    checkIpAddress().then(res => {
        setIpAddress(res)
    })

    useEffect(() => {
        getCurrentEmployee()
    })

    getCurrentEmployee = () => {
        firebase.firestore()
            .collection('employees')
            .where('email', '==', firebase.auth().currentUser?.email)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    setPermission(documentSnapshot.data()['permission_id'])
                    setEmpId(documentSnapshot.id)
                    
                });
            });
    }
    return (
        <View>
            <View>
                <CreateEvent props={{ ipAddress: ipAddress, permission: permission, empId: empId }} />
            </View>
        </View>
    )
}

export default Home
