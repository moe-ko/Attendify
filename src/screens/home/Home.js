import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import Geolocation from '../../../components/Geolocation'
import { checkIpAddress, getEmployeeId, isAdmin } from '../../../functions'
import CreateEvent from './Admin/CreateEvent'
import CurrentEvent from './CurrentEvent'

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
                <CreateEvent props={{ ipAddress: ipAddress, empId: empId }} />
                {/* )} */}

            </View>
        </View>
    )
}

export default Home
