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
import tailwind from '../../../constants/tailwind'
import Icon from 'react-native-vector-icons/Ionicons'

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

    useEffect(() => {
        // getEmployees()
    })


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
        <View className={`${tailwind.container}`}>
            {(currentEventVisible && currentEvent) ? (
                <View className="bg-white rounded-3xl mb-2 mt-3">
                    <View className="flex-row mt-4">
                        <Icon name="location-outline" size={45} color="#62ABEF"/>
                        <Text className={`${tailwind.inputs} text-xl text-[#BBBBBB]`}>{locationName}</Text>
                    </View>
                    <View>
                        <Text className={`${tailwind.slogan} mr-52 ml-3`}>Happenning now</Text>
                    </View>
                    
                    <View className="justify-center items-center">
                        <View className=" h-52 bg-[#62ABEF] mt-3 rounded-3xl justify-center items-center w-80 mb-3">
                        
                        <Text className={`${tailwind.textLine} mb-1`}>Session Code</Text>
                        <Text className={`${tailwind.textLine} mb-1`}>{currentEvent['code']}</Text>
                        <Text className={`${tailwind.textLine} mb-1`}>Expire {currentEvent['end']}</Text>
                        <Text className={`${tailwind.textLine} mb-3`}>in {hrs}:{mins}:{secs}</Text>
                        
                        
                        {/* <Text>Thank you for attending</Text> */}
                        {/* {hasAttended ? <Text>Thank you for attending</Text> : */}
                        <View>
                            <TextInput
                               className={`${tailwind.inputs}`}
                                value={code}
                                placeholder='Enter code event'
                                onChangeText={(text) => setCode(text)}
                                autoCorrect={false}
                                required
                                placeholderTextColor="#666"
                                />
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                className={`${tailwind.buttonBlue} mb-3 w-60 rounded-full h-15`}
                                
                                //title={'Attendify'}
                                onPress={() => {
                                    handleAttendify(code, currentEvent['id'])
                            }}>
                            <Text className={`${tailwind.buttonWhiteText}`}>Attendify</Text>
                            </TouchableOpacity>
                            
                            
                            </View>
                        {/* <TouchableOpacity
                            //title={'Cancel'}
                            className={`${tailwind.buttonBlue} w-60 rounded-full h-15 mb-3`}
                            onPress={() => {
                                alertCancelEvent(currentEvent['id']), getCurrentEvent()
                            }}>
                            <Text className={`${tailwind.buttonWhiteText}`}>Cancel</Text>
                            </TouchableOpacity> */}
                        
                        {/* } */}
                    </View>
                </View>
            ) : null}
            {/* {(createEventVisible) ? ( */}
            <View>
                <Text className={`${tailwind.textLine} text-black mt-5`}>Create a new session</Text>
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
        </View>
    )

}


export default Event