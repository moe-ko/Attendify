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
        
            <View className={`${tailwind.containerWrapper2}`}>
                <View className={`${tailwind.container2}`}>
                    </View>
            <View>
            
                <Image
                    className="h-20 w-20 rounded-full mx-auto my-[-80] mb-3"
                    source={{
                        uri: `${avatar}`,
                    }}

                />
            </View>
                    
            <View className="py-1 shadow-2xl justify-center items-center">
            <View><Text>User: {name}</Text></View>
            <View className="py-1"><Text>Employee Id: {empId}</Text></View>
             <View className=" bg-white mb-7 mt-7 rounded-2xl w-96 h-28 shadow-2xl"> 
                     
            <View className="flex-row ml-2 mt-7"><Text>Email:    </Text><Text>{email}</Text>
            </View>
            <View className="flex-row ml-2 mt-5"><Text>Unit:      </Text><Text>{unit} | {subunit}</Text></View>
            
            </View> 
            {permission == '1' ? (
                 <TouchableOpacity onPress={() => { console.log('Make admin')}}>
                    <Text>Make user an admin</Text>
                 </TouchableOpacity>
            ) : null}
               <TouchableOpacity className={`${tailwind.buttonBlue} bg-black w-96 mb-7`} onPress={() => { console.log('Link to SeeVee') }}>
                 <Text className={`${tailwind.buttonWhiteText}`}>SeeVee</Text>
                 </TouchableOpacity>

                 <TouchableOpacity  className={`${tailwind.buttonBlue} w-96 mb-7`} onPress={() => { handleSignOut()}}>
                 <Text className={`${tailwind.buttonWhiteText}`}>Sign Out</Text>
                 </TouchableOpacity>
            </View>
            
            </View>
            </View>
    )
}

export default Profile