import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { getEmployeeId } from '../../functions'
import { Avatar, ListItem } from '@rneui/themed';
import { firebase } from '../../config'
import tailwind from '../constants/tailwind';
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from '..';

const CustomDrawerComponent = props => {
    const [avatar, setAvatar] = useState('')
    const [name, setName] = useState('')
    const [id, setId] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        getEmployeeId().then(res => {
            setId(res)
            employeeDetails(res)
        })
    }, []);

    employeeDetails = (id) => {
        const subscriber = firebase.firestore()
            .collection('employees')
            .doc(id)
            .onSnapshot(documentSnapshot => {
                setAvatar(documentSnapshot.data()['avatar'])
                setName(documentSnapshot.data()['full_name'])
            });
        return () => subscriber();
    }
    const handleSignOut = () => {
        firebase.auth()
            .signOut()
            .then(() => {
                navigation.replace(ROUTES.WELCOME)
            })
            .catch(error => console.log(error.message))
    }


    return (
        <DrawerContentScrollView {...props} className={``}>
            <View className={`flex flex-col w-full h-screen`}>
                <View>
                    <ListItem>
                        <Avatar rounded size={70} source={{ uri: `${avatar}` }} />
                        <ListItem.Content>
                            <ListItem.Title className={`${tailwind.titleText} text-[#7E7E7E] text-2xl`}>{name}</ListItem.Title>
                            <ListItem.Subtitle className={`${tailwind.slogan}`}>{id}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <View>
                        <DrawerItemList {...props} />
                    </View>
                </View>
                <View className={`pb-20 px-5 mt-auto w-full`}>
                    <TouchableOpacity className={`${tailwind.buttonBlue}`} onPress={() => { handleSignOut() }}>
                        <Text className={`${tailwind.buttonWhiteText}`}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </DrawerContentScrollView >
    )
}

export default CustomDrawerComponent