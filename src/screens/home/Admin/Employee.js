
import { ListItem, Avatar } from '@rneui/base'
import React, { useState, useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { firebase } from '../../../../config'

const Employee = ({ route }) => {
    const [subunitId, setSubunitId] = useState(route.params['subunit_id'])
    const [unit, setUnit] = useState('')
    const [subunit, setSubunit] = useState('')
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

    return (
        <View>
            <Avatar rounded size={70} source={{ uri: `${route.params['avatar']}` }} />
            <Text>{route.params['full_name']}</Text>
            <Text>{route.params['employee_id']}</Text>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Email</ListItem.Title>
                </ListItem.Content>
                <Text>{route.params['email']}</Text>
                {/* <Icon name={icon} size={30} color={COLORS.primary} /> */}
            </ListItem>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Unit</ListItem.Title>
                </ListItem.Content>
                <Text>{unit}/{subunit}</Text>
                <ListItem.Chevron />
                {/* <Icon name={icon} size={30} color={COLORS.primary} /> */}
            </ListItem>

            <Button title="Make Admin" />
            <Button title="SeeVee" />
            <Button title="Check Report" />
            <Text>Bench Projects</Text>
            <Text>Project name</Text>
            <Text>Project name</Text>
        </View>

    )
}

export default Employee