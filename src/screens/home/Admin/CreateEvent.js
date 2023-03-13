import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Button, FlatList, Alert, TextInput, Modal, Platform, TouchableHighlight } from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
import { generatePasscode } from '../../../../functions'
import DateTimePicker from '@react-native-community/datetimepicker';


const CreateEvent = ({ props }) => {
    const [locations, setLocations] = useState();
    const [title, setTitle] = useState()
    const [selectedLocation, setSelectedLocation] = useState('');
    const [duration, setDuration] = useState(0);
    const [createEventVisible, setCreateEventVisible] = useState(true);
    const [currentEventVisible, setCurrentEventVisible] = useState(true);
    const [currentEvent, setCurrentEvent] = useState();
    const [locationName, setLocationName] = useState();
    const [mins, setMins] = useState('')
    const [secs, setSecs] = useState('')

    // eventTimer = () => {
    //     const eventExpirationDate = new Date("2023-03-13 16:25")
    //     setInterval(() => {
    //         const now = new Date().getTime()
    //         const timeLeft = eventExpirationDate - now

    //         const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    //         const secs = Math.floor((timeLeft % (1000 * 60)) / 1000)

    //         setMins(mins)
    //         setSecs(secs)

    //         if (timeLeft < 0) {
    //             clearInterval(eventTimer)
    //             setMins(mins)
    //             setSecs(secs)
    //         }
    //     }, 1000);
    // }
    // eventTimer()

    useEffect(() => {
        getEventLocations();
        getCurrentEvent();
    }, [])

    getEventLocations = () => {
        firebase.firestore()
            .collection('locations')
            .get()
            .then(querySnapshot => {
                let locations_data = []
                querySnapshot.forEach(documentSnapshot => {
                    locations_data.push({ key: `${documentSnapshot.id}`, value: `${documentSnapshot.data()["name"]}` });
                });
                setLocations(locations_data)
            });
    }

    handleEventCreation = (selectedLocation, title, duration, startDate, endDate) => {
        firebase.firestore()
            .collection('events')
            .add({
                created_at: format(new Date(), "dd MMMM yyyy - H:mm"),
                start_date: startDate,
                end_date: endDate,
                duration_mins: duration,
                ip_address: `${props.ipAddress}`,
                location: selectedLocation,
                passcode: generatePasscode(6),
                wifi_name: 'test_wifi',
                status_id: '1',
                title: title
            })
        // setCreateEventVisible(!createEventVisible)
        // getCurrentEvent()
        // setCurrentEventVisible(!currentEventVisible)

    }

    getCurrentEvent = () => {
        firebase.firestore().collection('events').onSnapshot({
            next: querySnapshot => {
                const event = querySnapshot.docs.map(docSnapshot => ({
                    id: docSnapshot.id,
                    passcode: docSnapshot.data()["passcode"],
                    location: docSnapshot.data()["location"],
                    duration_mins: docSnapshot.data()["duration_mins"]
                }))
                return setCurrentEvent(event)
            }
        })

        // firebase.firestore()
        //     .collection('events')
        //     .where('status_id', '==', '1')
        //     .get()
        //     .then(querySnapshot => {
        //         let event_data = []
        //         querySnapshot.forEach(documentSnapshot => {
        //             event_data.push({
        //                 id: documentSnapshot.id,
        //                 passcode: documentSnapshot.data()["passcode"],
        //                 location: documentSnapshot.data()["location"],
        //                 duration_mins: documentSnapshot.data()["duration_mins"]
        //             });
        //         });
        //         setCurrentEvent(event_data)
        //     });
    }

    getLocationName = () => {
        firebase.firestore()
            .collection('locations')
            .doc(location_id)
            .get()
            .then(documentSnapshot => {
                setLocationName(documentSnapshot.data()['name']);
            });
    }

    updateStatusEvent = (event_id) => {
        firebase.firestore()
            .collection('events')
            .doc(event_id)
            .update({
                status_id: '0',
            })
    }
    alertCancelEvent = (id) =>
        Alert.alert('Cancel Event', 'Are you sure you want to cancel this event?', [
            {
                text: 'No',
                onPress: () => console.log('No'),
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => cancelEvent(id) },
        ]);
    cancelEvent = (id) => {
        firebase.firestore()
            .collection('events')
            .doc(id)
            .delete()
            .then(() => {
                console.log('Event deleted!');
            });
    }

    Item = ({ id, passcode }) => (
        <View style={style.item}>
            <Text style={style.title}>Session Code</Text>
            <Text style={style.title}>{locationName}</Text>
            <Text style={style.title}>{passcode}</Text>
            <Text style={style.title}>Expire in</Text>
            <Button
                style={style.buttonBlue}
                title={'Cancel'}
                onPress={() => {
                    alertCancelEvent(id)
                }}
            />
        </View >
    );

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [show, setShow] = useState(false)

    setStartDateEvent = (event, startDate) => {
        setShow(Platform.OS === 'ios' ? true : false)
        setStartDate(startDate)
    }

    setEndDateEvent = (event, endDate) => {
        setShow(Platform.OS === 'ios' ? true : false)
        setEndDate(endDate)
    }

    return (
        <View>
            {currentEventVisible ? (
                <View>
                    <View>
                        <Text>Happenning now</Text>
                    </View>
                    <FlatList
                        data={currentEvent}
                        renderItem={({ item }) => <Item id={item.id} passcode={item.passcode} />}
                        keyExtractor={item => item.id}
                    />
                </View>
            ) : null}
            {(props.permission == 1 && createEventVisible) ? (
                <View>
                    <Text>Create a new session</Text>
                    <SelectList
                        data={locations}
                        setSelected={setSelectedLocation}
                        placeholder='Select Location'
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
                    <TextInput
                        style={style.input}
                        value={title}
                        placeholder={'Event title'}
                        onChangeText={(text) => setTitle(text)}
                        autoCorrect={false}
                        required
                    />
                    <DateTimePicker
                        value={startDate}
                        mode='datetime'
                        minimumDate={new Date()}
                        is24Hour={true}
                        display="default"
                        onChange={setStartDateEvent}
                    />
                    <DateTimePicker
                        value={endDate}
                        minimumDate={startDate}
                        mode='datetime'
                        is24Hour={true}
                        display="default"
                        onChange={setEndDateEvent}
                    />

                    <Button
                        style={style.buttonBlue}
                        title={'CreateEvent'}
                        onPress={() => {
                            handleEventCreation(selectedLocation, title, duration, startDate, endDate)
                        }}
                    />
                </View>
            ) : null}
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
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    }
})

export default CreateEvent