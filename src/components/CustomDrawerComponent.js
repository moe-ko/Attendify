import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { getEmployeeId } from '../../functions'
import { Avatar, ListItem } from '@rneui/themed';
import { firebase } from '../../config'

const CustomDrawerComponent = props => {
    const [avatar, setAvatar] = useState('')
    const [name, setName] = useState('')
    const [id, setId] = useState('')

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

    return (
        <DrawerContentScrollView {...props}>
            <ListItem>
                <Avatar rounded size={70} source={{ uri: `${avatar}` }} />
                <ListItem.Content>
                    <ListItem.Title>{name}</ListItem.Title>
                    <ListItem.Subtitle>{id}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
            <View>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    )
}

export default CustomDrawerComponent