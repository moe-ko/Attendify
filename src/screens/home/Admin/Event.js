import React, { useState, useEffect } from 'react'
import { View, Text, Alert, TextInput, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
import { getLocationName, getLocations, hanldeCreateEvent, alertCancelEvent, getPermission } from '../../../../functions'
import { arrayUnion } from "firebase/firestore";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import tailwind from '../../../constants/tailwind'
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from '@react-native-community/datetimepicker';
import { COLORS } from '../../..'

import DatePicker from 'react-native-datepicker';

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
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [permission, setPermission] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
    }, [permission])

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS == 'ios');
        setDate(currentDate);
        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        let fTime = 'Hours:' + tempDate.getDate() + '| Minutes:' + tempDate.getMinutes();
    }
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }

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

    const getCurrentEvent = () => {
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
                    } else {
                        setCurrentEvent('')
                    }
                }
            })
    }

    const getAttendance = () => {
        firebase.firestore()
            .collection('events')
            .doc(currentEvent['id'])
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.data()['attendance'].includes(props.empId)) {
                    setLoading(false)
                    setHasAttended(true)
                } else {
                    setLoading(false)
                    setHasAttended(false)
                }
            });
    }

    getAttendance()

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

    return (
        <ScrollView>
            <KeyboardAvoidingView>
                <View className=" h-screen items-center px-4 bg-[#ECF0F3] w-full">
                    {(currentEventVisible && currentEvent) ? (
                        <>
                            <View className={`${tailwind.viewWrapper}`}>
                                <View className="flex-row align-items-center my-2">
                                    <Icon name="location-outline" size={20} color="#62ABEF" className="pr-5" />
                                    <Text className={`${tailwind.slogan} text-[#7E7E7E]`}>{locationName}</Text>
                                </View>
                                <Text className={`${tailwind.titleText} text-[#7E7E7E] mb-2`}>Latest event</Text>
                                <View className={`${tailwind.viewWrapper} bg-[#62ABEF] rounded-2xl py-6`}>
                                    {permission == 'Admin' || permission == 'Super Admin' ? (
                                        <>
                                            <Text className={`${tailwind.titleText} font-light text-white text-center my-3`}>Session Code: </Text>
                                            <Text className={`${tailwind.titleText} tracking-widest text-white text-center my-3`}>{currentEvent['code']}</Text>
                                            <Text className={`${tailwind.slogan} text-white text-center  my-3`}>Expire {currentEvent['end']}</Text>
                                            <TouchableOpacity className={`${tailwind.buttonWhite} w-10/12 m-auto mb-6`} onPress={() => { alertCancelEvent(currentEvent['id']), getCurrentEvent() }}>
                                                <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <>
                                            {loading ?
                                                <>
                                                    <Text className={`${tailwind.titleText} font-light text-white text-center my-6`}>Checking attendance</Text>
                                                    <ActivityIndicator size={100} color="white" />

                                                </>
                                                :
                                                <>
                                                    {hasAttended ?
                                                        <>
                                                            <Text className={`${tailwind.titleText} font-light text-white text-center my-3`}>Attendance recorded successfully</Text>
                                                            <View className="flex-row align-items-center justify-center my-5">
                                                                <Icon
                                                                    name="checkmark-done"
                                                                    color='white'
                                                                    size={100}
                                                                />
                                                            </View>
                                                        </>
                                                        :
                                                        <>
                                                            <Text className={`${tailwind.slogan}  text-3xl text-white text-center mt-4`}>{currentEvent['title']}</Text>
                                                            <Text className={`${tailwind.slogan} text-white text-center my-3`}>Expire at {currentEvent['end']}</Text>
                                                            <TextInput
                                                                className={`${tailwind.inputs} w-10/12 m-auto`}
                                                                value={code}
                                                                placeholder='Enter event code'
                                                                onChangeText={(text) => setCode(text)}
                                                                autoCorrect={false}
                                                                required
                                                            />
                                                            <TouchableOpacity className={`${tailwind.buttonWhite} w-10/12 m-auto mt-3 mb-5`} onPress={() => { handleAttendify(code, currentEvent['id']) }} >
                                                                <Text className={`${tailwind.buttonBlueText}`}>Attendify</Text>
                                                            </TouchableOpacity>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </>
                                    )}
                                </View>
                            </View>
                        </>
                    ) : null}
                    {/* {(createEventVisible) ? ( */}
                    {permission == 'Admin' || permission == 'Super Admin' ? (
                        <View className={`${tailwind.viewWrapper}`}>
                            <Text className={`${tailwind.titleText} text-[#7E7E7E] mb-2`}>Create a new session</Text>
                            <View className={`${tailwind.viewWrapper} bg-[#62ABEF] rounded-2xl`}>
                                <View className={` w-10/12 m-auto mt-5`}>
                                    <SelectList
                                        data={locations}
                                        setSelected={setSelectedLocation}
                                        placeholder='Select Location'
                                        placeholderTextColor='#726F6F'
                                        inputStyles={{
                                            color: "#666",
                                            padding: 0,
                                            margin: 0,
                                        }}
                                        boxStyles={{
                                            borderRadius: 15,
                                            borderColor: '#fff',
                                            color: '#fff',
                                            backgroundColor: '#fff'
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
                                </View>
                                <TextInput
                                    className={`${tailwind.inputs} w-10/12 m-auto my-3`}
                                    value={title}
                                    placeholder={'Event title'}
                                    onChangeText={(text) => setTitle(text)}
                                    autoCorrect={false}
                                />
                                <View className={`${tailwind.viewWrapper} flex-column justify-center items-center`}>
                                    <Text className={`${tailwind.slogan}  text-white text-center mb-3`}>Select expiration date</Text>
                                    <RNDateTimePicker
                                        style={{ textColor: "blue" }}
                                        value={time}
                                        mode={'datetime'}
                                        display={Platform.OS === `ios` ? `default` : `default`}
                                        is24Hour={false}
                                        onChange={() => setTime(time)}
                                    />
                                    {Platform.OS == 'android' && (
                                        <View>
                                            <View className="flex-row">
                                                <View className="mx-1 ">
                                                    <TouchableOpacity className={`${tailwind.buttonWhite} w-36`} onPress={() => showMode('date')}>
                                                        <Text className={`${tailwind.buttonBlueText} text-sm`}>
                                                            Selet Date
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View className="ml-2">
                                                    <TouchableOpacity className={`${tailwind.buttonWhite} w-36`} onPress={() => showMode('time')}>
                                                        <Text className={`${tailwind.buttonBlueText} text-sm`}>Select Time</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            {show && (
                                                <DateTimePicker
                                                    testID='dateTimePicker'
                                                    value={date}
                                                    mode={mode}
                                                    is24Hour={true}
                                                    display='default'
                                                    onChange={onChange} />
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className="justify-center items-center">
                                <TouchableOpacity className={`${tailwind.buttonBlue} w-80 mb-4`}
                                    onPress={() => {
                                        hanldeCreateEvent(selectedLocation, title, time), getCurrentEvent()
                                    }}>
                                    <Text className={`${tailwind.buttonWhiteText}`}>Create Event</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                </View>
            </KeyboardAvoidingView>
        </ScrollView>







    )

}
const styles = StyleSheet.create({

});


export default Event
