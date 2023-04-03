
import { ListItem, Avatar, BottomSheet } from '@rneui/base'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../..'
import { firebase } from '../../../../config'

const Employee = ({ route }) => {
    const [subunitId, setSubunitId] = useState(route.params['subunit_id'])
    const [permission, setPermission] = useState(route.params['permission'])
    const [unit, setUnit] = useState('')
    const [subunit, setSubunit] = useState('')
    const [isPermissionVisible, setIsPermissionVisible] = useState(false);
    const [isUnitVisible, setIsUnitVisible] = useState(false);

    useEffect(() => {
        getSubunits(subunitId)
    }, [subunitId])

    const getSubunits = (id) => {
        firebase.firestore()
            .collection('subunits')
            .doc(id)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setSubunit(documentSnapshot.data()['name']);
                    getUnits(documentSnapshot.data()['unit_id'])
                }
            });
    }
    const getUnits = (id) => {
        firebase.firestore()
            .collection('units')
            .doc(id)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setUnit(documentSnapshot.data()['name']);
                }
            });
    }

    const bottomSheetPermission = [
        {
            title: 'Super Admin',
            icon: 'person-add-outline',
            containerStyle: { backgroundColor: permission == 'Super Admin' ? COLORS.lightblue500 : 'white', marginHorizontal: 15, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
            onPress: () => { permission == 'Super Admin' ? '' : updatePermission(route.params['employee_id'], 'Super Admin') }
        },
        {
            title: 'Admin',
            icon: 'person-outline',
            containerStyle: { backgroundColor: permission == 'Admin' ? COLORS.lightblue500 : 'white', marginHorizontal: 15 },
            onPress: () => { permission == 'Admin' ? '' : updatePermission(route.params['employee_id'], 'Admin') }
        },
        {
            title: 'Associate',
            icon: 'people-outline',
            containerStyle: { backgroundColor: permission == 'Associate' ? COLORS.lightblue500 : 'white', marginHorizontal: 15, marginBottom: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
            onPress: () => { permission == 'Associate' ? '' : updatePermission(route.params['employee_id'], 'Associate') }
        },
        { title: 'Cancel', icon: 'arrow-down', containerStyle: { marginBottom: 30, padding: 20, marginHorizontal: 15, borderRadius: 20 }, titleStyle: { color: 'white' }, onPress: () => setIsPermissionVisible(false) },
    ];
    const bottomSheetUnit = [
        {
            title: 'Unit',
            icon: 'person-add-outline',
            // containerStyle: { backgroundColor: permission == 'Super Admin' ? COLORS.lightblue500 : 'white' },
            // onPress: () => { permission == 'Super Admin' ? '' : updatePermission(route.params['employee_id'], 'Super Admin') }
        },
        {
            title: 'Unit 2',
            icon: 'person-outline',
            // containerStyle: { backgroundColor: permission == 'Admin' ? COLORS.lightblue500 : 'white' },
            // onPress: () => { permission == 'Admin' ? '' : updatePermission(route.params['employee_id'], 'Admin') }
        },
        {
            title: 'Unit 3',
            icon: 'people-outline',
            // containerStyle: { backgroundColor: permission == 'Associate' ? COLORS.lightblue500 : 'white' },
            // onPress: () => { permission == 'Associate' ? '' : updatePermission(route.params['employee_id'], 'Associate') }
        },
        { title: 'Cancel', containerStyle: { backgroundColor: 'red', paddingBottom: 30 }, titleStyle: { color: 'white' }, onPress: () => setIsUnitVisible(false) },
    ];

    updatePermission = (id, newPermission) => {
        firebase.firestore()
            .collection('employees')
            .doc(id)
            .update({
                permission: newPermission,
            })
            .then(() => {
                console.log('User updated!');
            });
        setIsPermissionVisible(false)
        setPermission(newPermission)
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView>
                <View>
                    <Avatar rounded size={70} source={{ uri: `${route.params['avatar']}` }} />
                    <Text>{route.params['full_name']}</Text>
                    <Text>{route.params['employee_id']}</Text>
                    <TouchableOpacity onPress={() => { setIsPermissionVisible(true) }}>
                        <ListItem bottomDivider>
                            <Avatar
                                rounded
                                icon={{
                                    name: 'person-outline',
                                    type: 'material',
                                    size: 26,
                                }}
                                containerStyle={{ backgroundColor: COLORS.primary }}
                            />
                            <ListItem.Content>
                                <ListItem.Title>User</ListItem.Title>
                            </ListItem.Content>
                            <Text>{permission}</Text>
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <ListItem bottomDivider>
                        <Avatar
                            rounded
                            icon={{
                                name: 'mail-outline',
                                type: 'material',
                                size: 26,
                            }}
                            containerStyle={{ backgroundColor: COLORS.primary }}
                        />
                        <ListItem.Content>
                            <ListItem.Title>Email</ListItem.Title>
                        </ListItem.Content>
                        <Text>{route.params['email']}</Text>
                    </ListItem>
                    <TouchableOpacity onPress={() => { setIsUnitVisible(true) }}>
                        <ListItem>
                            <Avatar rounded containerStyle={{ backgroundColor: COLORS.primary }}
                                icon={{
                                    name: 'people-outline',
                                    type: 'material',
                                    size: 26,
                                }}
                            />
                            <ListItem.Content>
                                <ListItem.Title>Unit/Subunit</ListItem.Title>
                            </ListItem.Content>
                            <Text>{unit}/{subunit}</Text>
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <Button title="SeeVee" />
                    <Button title="Check Report" />
                    <Text>Bench Projects</Text>
                    <Text>Project name</Text>
                    <Text>Project name</Text>
                    <BottomSheet isVisible={isPermissionVisible}>
                        {bottomSheetPermission.map((l, i) => (
                            <ListItem bottomDivider key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                                <Icon name={l.icon} size={30} color={COLORS.primary} />
                                <ListItem.Content>
                                    <ListItem.Title >{l.title}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </BottomSheet>
                    <BottomSheet isVisible={isUnitVisible}>
                        {bottomSheetUnit.map((l, i) => (
                            <ListItem bottomDivider key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                                <Icon name={l.icon} size={30} color={COLORS.primary} />
                                <ListItem.Content>
                                    <ListItem.Title >{l.title}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </BottomSheet>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Employee