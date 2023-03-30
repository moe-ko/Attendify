
import { ListItem, Avatar, BottomSheet } from '@rneui/base'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../..'
import { firebase } from '../../../../config'

const Employee = ({ route }) => {
    const [subunitId, setSubunitId] = useState(route.params['subunit_id'])
    const [permission, setPermission] = useState(route.params['permission'])
    const [unit, setUnit] = useState('')
    const [subunit, setSubunit] = useState('')
    const [isVisible, setIsVisible] = useState(false);

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

    const bottomSheetList = [
        {
            title: 'Attend',
            // icon: statusIcon('attendance'),
            // containerStyle: { backgroundColor: currentStatus == 'attendance' ? COLORS.lightblue500 : 'white' },
            // onPress: () => { currentStatus == 'attendance' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'attendance') }
        },
        // {
        //     title: 'Absent',
        //     icon: statusIcon('absent'),
        //     containerStyle: { backgroundColor: currentStatus == 'absent' ? COLORS.lightblue500 : 'white' },
        //     onPress: () => { currentStatus == 'absent' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'absent') }
        // },
        // {
        //     title: 'Sick',
        //     icon: statusIcon('sick_leave'),
        //     containerStyle: { backgroundColor: currentStatus == 'sick_leave' ? COLORS.lightblue500 : 'white' },
        //     onPress: () => { currentStatus == 'sick_leave' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'sick_leave') }
        // },
        // {
        //     title: 'Holiday',
        //     icon: statusIcon('annual_leave'),
        //     containerStyle: { backgroundColor: currentStatus == 'annual_leave' ? COLORS.lightblue500 : 'white' },
        //     onPress: () => { currentStatus == 'annual_leave' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'annual_leave') }
        // },
        { title: 'Cancel', containerStyle: { backgroundColor: 'red', paddingBottom: 30 }, titleStyle: { color: 'white' }, onPress: () => setIsVisible(false) },
    ];

    return (
        <View>
            <Avatar rounded size={70} source={{ uri: `${route.params['avatar']}` }} />
            <Text>{route.params['full_name']}</Text>
            <Text>{route.params['employee_id']}</Text>
            <ListItem.Swipeable bottomDivider rightWidth={90} minSlideWidth={10} rightContent={() => (
                <TouchableOpacity
                    style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex', backgroundColor: '#62ABEF', height: '100%' }}
                    onPress={() => { setIsVisible(true) }}>
                    <Icon name="ellipsis-horizontal" size={30} color="white" />
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>More</Text>
                </TouchableOpacity>
            )}>
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
                {/* <Icon name={icon} size={30} color={COLORS.primary} /> */}
            </ListItem.Swipeable>
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
                {/* <Icon name={icon} size={30} color={COLORS.primary} /> */}
            </ListItem>
            <ListItem.Swipeable bottomDivider rightWidth={90} minSlideWidth={10} rightContent={() => (
                <TouchableOpacity
                    style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex', backgroundColor: '#62ABEF', height: '100%' }}
                    onPress={() => { setIsVisible(true) }}>
                    <Icon name="ellipsis-horizontal" size={30} color="white" />
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>More</Text>
                </TouchableOpacity>
            )}>
                <Avatar
                    rounded
                    icon={{
                        name: 'people-outline',
                        type: 'material',
                        size: 26,
                    }}
                    containerStyle={{ backgroundColor: COLORS.primary }}
                />
                <ListItem.Content>
                    <ListItem.Title>Unit/Subunit</ListItem.Title>
                </ListItem.Content>
                <Text>{unit}/{subunit}</Text>
                <ListItem.Chevron />
                {/* <Icon name={icon} size={30} color={COLORS.primary} /> */}
            </ListItem.Swipeable>
            <Button title="SeeVee" />
            <Button title="Check Report" />
            <Text>Bench Projects</Text>
            <Text>Project name</Text>
            <Text>Project name</Text>
            <BottomSheet isVisible={isVisible}>
                {bottomSheetList.map((l, i) => (
                    <ListItem bottomDivider key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <Icon name={l.icon} size={30} color={COLORS.primary} />
                        <ListItem.Content>
                            <ListItem.Title >{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>
        </View>

    )
}

export default Employee