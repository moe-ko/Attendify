import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import { checkIpAddress, getEmployeeId, isAdmin } from '../../../functions'
import Event from './Admin/Event'
import Geolocation from '../../components/Geolocation'

const Home = ({ navigation }) => {
    const [ipAddress, setIpAddress] = useState('')
    const [empId, setEmpId] = useState('')
    const [loading, setLoading] = useState(true)

    checkIpAddress().then(res => {
        setIpAddress(res)
    })

    useEffect(() => {
        if (loading) {
            getEmployeeId().then(res => {
                setEmpId(res)
                setLoading(false)
            })
        }
    }, []);

    return (
        <View>
            <View>
                {/* {loading ? (
                    <Text>Loading</Text>
                ) : ( */}
                {/* <Geolocation /> */}
                <Event props={{ ipAddress: ipAddress, empId: empId }} />
                {/* )} */}

            </View>
        </View>
    )
}

export default Home
