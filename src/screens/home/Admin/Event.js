import React, { useState, useEffect, Suspense } from 'react'
import { View, Text, Button, Alert, TextInput, Platform, TouchableOpacity } from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
import { getLocationName, getLocations, hanldeCreateEvent, alertCancelEvent } from '../../../../functions'
// import DateTimePicker from '@react-native-community/datetimepicker';
import { arrayUnion } from "firebase/firestore";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import PieChart from './Chart'


const Event = ({ props }) => {
    const [locations, setLocations] = useState('');
    const [title, setTitle] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('');
    const [createEventVisible, setCreateEventVisible] = useState(true);
    const [currentEventVisible, setCurrentEventVisible] = useState(true);
    const [currentEvent, setCurrentEvent] = useState([]);
    const [locationName, setLocationName] = useState();
    const [mins, setMins] = useState('')
    const [secs, setSecs] = useState('')
    const [hrs, setHrs] = useState('')
    const [code, setCode] = useState()
    const [hasAttended, setHasAttended] = useState(false)
    const [time, setTime] = useState(new Date())

    eventTimer = (end) => {
        const eventExpirationDate = new Date(end)
        setInterval(() => {
            const now = new Date().getTime()
            const timeLeft = eventExpirationDate - now
            const hrs = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
            const secs = Math.floor((timeLeft % (1000 * 60)) / 1000)
            setHrs(hrs)
            setMins(mins)
            setSecs(secs)
            if (timeLeft < 0) {
                clearInterval(eventTimer)
                setHrs(0)
                setMins(0)
                setSecs(0)

            }
        }, 1000);
    }

    if (locations == '') {
        getLocations().then(res => {
            setLocations(res)
        })
    }

    getCurrentEvent = () => {
        firebase.firestore()
            .collection('events')
            .orderBy('end', 'desc')
            .onSnapshot({
                next: querySnapshot => {
                    const res = querySnapshot.docs.map(docSnapshot => (
                        {
                            id: docSnapshot.id,
                            location: docSnapshot.data()['location'],
                            code: docSnapshot.data()['code'],
                            title: docSnapshot.data()['title'],
                            end: docSnapshot.data()['end'],
                        }
                    ))
                    if (res.length > 0) {
                        setCurrentEvent(res[0])
                        if (res[0]['location'] != '') {
                            getLocationName(res[0]['location']).then(res => {
                                setLocationName(res)
                            })
                        }
                        // eventTimer(res[0]['end'])
                        getAttendance()
                    } else {
                        setCurrentEvent('')
                    }
                }
            })
    }

    if (currentEvent.length == 0) {
        getCurrentEvent()
    }

    updateStatusEvent = (event_id) => {
        const subscriber = firebase.firestore()
            .collection('events')
            .doc(event_id)
            .update({
                status_id: '0',
            })
        subscriber();
    }

    handleAttendify = (code, eventId) => {
        if (currentEvent['code'] === code) {
            firebase.firestore()
                .collection('events')
                .doc(eventId)
                .update({
                    attendance: arrayUnion(props.empId),
                })
            Alert.alert('Event attendance', 'Your attendance has been registered!', [
                { text: 'Ok' },
            ]);
            getAttendance()
        } else {
            Alert.alert('Event code', 'Code is incorrect', [
                { text: 'Ok' },
            ]);
        }
    }

    getAttendance = () => {
        firebase.firestore()
            .collection('events')
            .doc(currentEvent['id'])
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.data()['attendance'].includes(props.empId)) {
                    setHasAttended(true)
                } else {
                    setHasAttended(false)
                }
            });
    }
    return (
        <View>
            {(currentEventVisible && currentEvent) ? (
                <View>
                    <View>
                        <Text>Happenning now</Text>
                    </View>
                    <View >
                        <Text>{locationName}</Text>
                        <Text>Session Code</Text>
                        <Text >{currentEvent['code']}</Text>
                        <Text>Expire {currentEvent['end']}</Text>
                        <Text>in {hrs}:{mins}:{secs}</Text>

                        <Button
                            title={'Cancel'}
                            onPress={() => {
                                alertCancelEvent(currentEvent['id']), getCurrentEvent()
                            }}
                        />
                        <Text>Thank you for attending</Text>
                        {/* {hasAttended ? <Text>Thank you for attending</Text> : */}
                        <View>
                            <TextInput
                                value={code}
                                placeholder='Enter code event'
                                onChangeText={(text) => setCode(text)}
                                autoCorrect={false}
                                required
                                placeholderTextColor="#666"
                            />
                            <Button
                                title={'Attendify'}
                                onPress={() => {
                                    handleAttendify(code, currentEvent['id'])
                                }}
                            />
                        </View>
                        {/* } */}
                    </View >
                </View>
            ) : null}
            {/* {(createEventVisible) ? ( */}
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
                    value={title}
                    placeholder={'Event title'}
                    onChangeText={(text) => setTitle(text)}
                    autoCorrect={false}
                />
                <View>
                    <RNDateTimePicker
                        value={time}
                        mode={'datetime'}
                        display={Platform.OS === `ios` ? `default` : `default`}
                        is24Hour={false}
                        onChange={() => setTime(time)}
                    />
                </View>
                <Button
                    title={'CreateEvent'}
                    onPress={() => {
                        hanldeCreateEvent(selectedLocation, title, time), getCurrentEvent()
                    }}
                />
            </View>
            {/* ) : null} */}
        </View >
    )

}


export default Event