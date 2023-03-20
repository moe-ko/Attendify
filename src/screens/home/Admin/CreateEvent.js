import React, { useState, useEffect } from 'react'
import { View, Text, Button, Alert, TextInput, Platform } from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
import { generatePasscode, getLocationName, getLocations, hanldeCreateEvent, alertCancelEvent, cancelEvent } from '../../../../functions'
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";


const CreateEvent = ({ props }) => {
    const [locations, setLocations] = useState();
    const [title, setTitle] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('');
    const [duration, setDuration] = useState(0);
    const [createEventVisible, setCreateEventVisible] = useState(true);
    const [currentEventVisible, setCurrentEventVisible] = useState(true);
    const [currentEventId, setCurrentEventId] = useState([]);
    const [currentEvent, setCurrentEvent] = useState([]);
    const [locationName, setLocationName] = useState();
    const [mins, setMins] = useState('')
    const [secs, setSecs] = useState('')
    const [hrs, setHrs] = useState('')
    const [code, setCode] = useState('XN0K8Q')
    const [hasAttended, setHasAttended] = useState(false)

    // eventTimer = (end) => {
    //     const eventExpirationDate = new Date(end)
    //     setInterval(() => {
    //         const now = new Date().getTime()
    //         const timeLeft = eventExpirationDate - now
    //         const hrs = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //         const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    //         const secs = Math.floor((timeLeft % (1000 * 60)) / 1000)
    //         setHrs(hrs)
    //         setMins(mins)
    //         setSecs(secs)
    //         if (timeLeft < 0) {
    //             clearInterval(eventTimer)
    //             setHrs(0)
    //             setMins(0)
    //             setSecs(0)

    //         }
    //     }, 1000);
    // }

    useEffect(() => {
        // if (currentEvent.length == 0) {
        //     getCurrentEvent()
        //     console.log(currentEvent)
        // }
        // getAttendance()
    }, [])

    getLocations().then(res => {
        setLocations(res)
    })
    // console.log(cancelEvent())

    getCurrentEvent = () => {
        firebase.firestore()
            .collection('events')
            .orderBy('end', 'asc')
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
                        getAttendance()
                    }

                    // eventTimer(event[0]['end_date'])
                    // eventTimer()
                    // eventTimer()

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

    handleAttendify = (code, eventId, userId) => {
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
            {(currentEventVisible && currentEvent) ? (
                <View>
                    <View>
                        <Text>Happenning now</Text>
                    </View>
                    <View >
                        <Text>{locationName}</Text>
                        <Text>Session Code</Text>
                        <Text >{currentEvent['code']}</Text>
                        <Text>Expire in {hrs}:{mins}:{secs}</Text>

                        <Button
                            title={'Cancel'}
                            onPress={() => {
                                alertCancelEvent(currentEvent['id'])
                            }}
                        />
                        {hasAttended ? <Text>Thank you for attending</Text> :
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
                                        handleAttendify(code, currentEvent['id'], props.empId)
                                    }}
                                />
                            </View>
                        }
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
                    <Text>End date and time</Text>
                    <DateTimePicker
                        value={endDate}
                        minimumDate={new Date()}
                        mode='datetime'
                        is24Hour={true}
                        display="default"
                        onChange={setEndDateEvent}
                    />
                </View>
                <Button

                    title={'CreateEvent'}
                    onPress={() => {
                        hanldeCreateEvent(selectedLocation, title, endDate), getCurrentEvent()
                    }}
                />
            </View>
            {/* ) : null} */}
        </View >
    )

}


export default CreateEvent