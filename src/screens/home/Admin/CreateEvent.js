import React, { useState } from 'react'
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
const CreateEvent = () => {
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState(0);
    const minutes = [
        { key: 2, value: 2 },
        { key: 30, value: 30 },
        { key: 60, value: 60 },
    ]
    handleEventCreation = (location, duration) => {
        firebase.firestore()
            .collection('events')
            .add({
                created_at: format(new Date(), "dd MMMM yyyy - H:mm:ss"),
                created_by: '123456',
                duration_mins: duration,
                location: location,

            })
    }

    return (
        <View>
            <TextInput
                style={style.input}
                value={location}
                placeholder={'Location'}
                onChangeText={(text) => setLocation(text)}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                required
            />
            <SelectList
                data={minutes}
                setSelected={setDuration}
                placeholder='Select Duration (mins)'
                inputStyles={{
                    color: "#666",
                    padding: 0,
                    margin: 0,
                }}
                boxStyles={{
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: '#000',
                    color: '#fff',
                    margin: 5,
                }}
                dropdownStyles={{
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: '#DDDDDD',
                    backgroundColor: '#DDDDDD',
                    color: '#fff',
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 5,
                    marginTop: 0,
                    position: 'relative'
                }}
            />
            <TouchableOpacity
                style={style.buttonBlue}
                onPress={() => { handleEventCreation(location, duration) }}
            >
                <Text>Create event</Text>
            </TouchableOpacity>
        </View >
    )
}
const style = StyleSheet.create({

    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 4,
        margin: 5
    },
    buttonGray: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 4,
        margin: 5
    },
    buttonBlue: {
        alignItems: 'center',
        backgroundColor: '#62ABEF',
        padding: 10,
        borderRadius: 4,
        margin: 5
    },
})

export default CreateEvent