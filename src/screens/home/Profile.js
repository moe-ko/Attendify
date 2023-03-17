import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import Geolocation from '../../../components/Geolocation'
import { checkIpAddress } from '../../../functions'
import * as ImagePicker from 'expo-image-picker'

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
    const [image, setImage] = useState('');

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

const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
    })
    console.log(result);
    if (!result.canceled) {
        setImage(result.uri);
      }
    }


    return (
        <View>
            <View>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                    }}
                    source={{
                        uri: `${image ? image : avatar}`,
                    }}

                />

            </View>
            <View>
            <TouchableOpacity onPress={() => { pickImage() }}>
                <Text>pick an image from camera roll</Text>
            </TouchableOpacity>
            {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
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