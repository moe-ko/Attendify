import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { firebase } from '../../config'
import { useNavigation } from '@react-navigation/native'
import Geolocation from '../../components/Geolocation'

const Home = () => {
    const navigation = useNavigation()
    const handleSignOut = () => {
        firebase.auth()
            .signOut()
            .then(() => {
                navigation.replace('Sign In')
            })
            .catch(error => alert(error.message))
    }
    return (
        <View>
            <View><Text>User: {firebase.auth().currentUser?.email}</Text></View>
            <TouchableOpacity onPress={() => { handleSignOut() }}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </View>

    )
}

export default Home