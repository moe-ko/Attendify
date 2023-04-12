import React, { useState, useEffect, useCallback } from 'react'
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
import { TimePickerModal, DatePickerModal } from 'react-native-paper-dates'
import { SafeAreaView } from 'react-native-safe-area-context'
import { registerTranslation } from 'react-native-paper-dates'
registerTranslation('pl', {
    save: 'Save',
    selectSingle: 'Select date',
    selectMultiple: 'Select dates',
    selectRange: 'Select period',
    notAccordingToDateFormat: (inputFormat) =>
        `Date format must be ${inputFormat}`,
    mustBeHigherThan: (date) => `Must be later then ${date}`,
    mustBeLowerThan: (date) => `Must be earlier then ${date}`,
    mustBeBetween: (startDate, endDate) =>
        `Must be between ${startDate} - ${endDate}`,
    dateIsDisabled: 'Day is not allowed',
    previous: 'Previous',
    next: 'Next',
    typeInDate: 'Type in date',
    pickDateFromCalendar: 'Pick date from calendar',
    close: 'Close',
})
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
    const [time, setTime] = useState(undefined)
    const [date, setDate] = useState(undefined);
    const [timePickerVisible, setTimePickerVisible] = useState(false)
    const [datePickerVisible, setDatePickerVisible] = useState(false)
    const [permission, setPermission] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
    }, [permission])

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

    const onDismissDate = () => {
        setDatePickerVisible(false)
    }

    const onConfirmDate = (params) => {
        setDatePickerVisible(false)
        setDate(params.date)
    }

    const onDismissTime = () => {
        setTimePickerVisible(false)
    }

    const onConfirmTime = ({ hours, minutes }) => {
        setTimePickerVisible(false)
        setTime(`${hours}:${minutes}`)
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
                                    placeholderTextColor='#726F6F'
                                />
                                <View className={`${tailwind.viewWrapper} flex-column justify-center items-center`}>
                                    <View className={`flex-row justify-between w-10/12`}>
                                        <TouchableOpacity className={`py-[2] bg-white rounded-2xl w-[48%]`} onPress={() => setDatePickerVisible(true)}>
                                            <View className="pl-[10] flex-row align-items-center my-2">
                                                <Icon name="calendar" size={20} color="#62ABEF" className={`text-[#726F6F] ml-3`} />
                                                <Text className={`text-[#726F6F] ml-3 my-auto`}>{date == undefined ? 'Date' : format(date, 'dd-MMM-yy')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity className={`py-[2] bg-white rounded-2xl w-[48%]`} onPress={() => setTimePickerVisible(true)}>
                                            <View className="pl-[10] flex-row align-items-center my-2">
                                                <Icon name="time" size={20} color="#62ABEF" className={`text-[#726F6F] ml-3`} />
                                                <Text className={`text-[#726F6F]  ml-3 my-auto`}>{time == undefined ? 'Time' : time}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <DatePickerModal
                                        locale='en'
                                        mode='single'
                                        visible={datePickerVisible}
                                        onDismiss={onDismissDate}
                                        date={date}
                                        onConfirm={onConfirmDate} />
                                    <TimePickerModal
                                        visible={timePickerVisible}
                                        onDismiss={onDismissTime}
                                        hours={format(new Date, 'H') - 1}
                                        minutes={format(new Date, 'mm')}
                                        onConfirm={onConfirmTime}
                                    />
                                </View>
                            </View>
                            <View className="justify-center items-center">
                                <TouchableOpacity className={`${tailwind.buttonBlue} w-80 mb-4`}
                                    onPress={() => {
                                        hanldeCreateEvent(selectedLocation, title, date, time), getCurrentEvent()
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

export default Event
