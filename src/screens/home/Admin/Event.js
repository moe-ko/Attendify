import React, { useState, useEffect } from 'react'
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator, Platform } from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
import { getLocationName, getLocations, hanldeCreateEvent, alertCancelEvent, getPermission, getEmployeesByStatus, getEventIpAddress } from '../../../../functions'
import { arrayUnion } from "firebase/firestore";
import tailwind from '../../../constants/tailwind'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../..'
import { TimePickerModal, DatePickerModal, registerTranslation } from 'react-native-paper-dates'
import OTPInputView from '@twotalltotems/react-native-otp-input';

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
    const [sickEmps, setSickEmps] = useState([])
    const [leaveEmps, setLeaveEmps] = useState([])
    const [inactiveEmps, setInactiveEmps] = useState([])
    const [eventIpAddress, setEventIpAddress] = useState('')
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
        getEmployeesByStatus('0').then(res => setInactiveEmps(res))
        getEmployeesByStatus('2').then(res => setLeaveEmps(res))
        getEmployeesByStatus('3').then(res => setSickEmps(res))
        getEventIpAddress(currentEvent['id']).then(res => setEventIpAddress(res))
    }, [permission, eventIpAddress])

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
                            ip_address: docSnapshot.data()['ip_address'],
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
                if (documentSnapshot.data()['attendance'].includes(props.empId) || documentSnapshot.data()['absent'].includes(props.empId) || documentSnapshot.data()['sick_leave'].includes(props.empId) || documentSnapshot.data()['annual_leave'].includes(props.empId)) {
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

    const checkEventIp = (code, eventId, eventIp, eventLoc, currentIp) => {
        if (locationName != 'Online' && eventIpAddress != currentEvent['ip_address']) {
            Alert.alert('Check your connection', 'Please connect to the same Manager wifi network and try again', [
                {
                    text: 'Ok',
                },
            ]);
        } else {
            handleAttendify(code, eventId)
        }
    }

    return (
        <>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  >
                    <View className="h-screen items-center px-4 w-full">
                        {(currentEventVisible && currentEvent) ? (
                            <>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <View className="flex-row align-items-center my-2">
                                        <Icon name="location-outline" size={20} color="#62ABEF" className="pr-5" />
                                        <Text className={`${tailwind.slogan} text-[#7E7E7E]`}>{locationName}</Text>
                                    </View>
                                    <Text className={`${tailwind.titleText} text-[#7E7E7E] mb-2`}>Latest event</Text>
                                    <View className={`${tailwind.viewWrapper} bg-[#62ABEF] rounded-2xl`}>
                                        {permission == 'Admin' || permission == 'Super Admin' ? (
                                            <>
                                                <Text className={`${tailwind.titleText} font-light text-white text-center my-3`}>Session Code:</Text>
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
                                                                <View className={`w-10/12 h-20 m-auto`}>
                                                                    <OTPInputView
                                                                        pinCount={6}
                                                                        autoFocusOnLoad={false}
                                                                        codeInputFieldStyle={{
                                                                            color: COLORS.primary,
                                                                            fontWeight: 'bold',
                                                                            fontSize: 30,
                                                                            height: 45,
                                                                            borderWidth: 0,
                                                                            borderBottomWidth: 3,
                                                                            backgroundColor: 'white'

                                                                        }}
                                                                        codeInputHighlightStyle={{ borderColor: "#717171", }}
                                                                        onCodeFilled={code => { setCode(code), setDisabled(!disabled) }}
                                                                    />
                                                                </View>
                                                                <TouchableOpacity
                                                                    className={`${tailwind.buttonWhite} w-10/12 m-auto mt-3 mb-5`}
                                                                    onPress={() => { checkEventIp(code, currentEvent['id']) }}
                                                                    disabled={disabled}
                                                                >
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

                                    <View className={`${tailwind.viewWrapper} flex-column justify-center items-center mb-5`}>
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
                                            onConfirm={onConfirmDate}
                                            theme={
                                                { colors: { primary: COLORS.primary } }
                                            }
                                        />
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
                                            hanldeCreateEvent(selectedLocation, title, date, time, inactiveEmps, sickEmps, leaveEmps), getCurrentEvent()
                                        }}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Create Event</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </>
    )
}

export default Event
