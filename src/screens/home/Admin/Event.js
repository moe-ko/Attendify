import React, { useState, useEffect } from 'react'
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator, Platform, FlatList, Button } from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
import { getLocationName, getLocations, hanldeCreateEvent, alertCancelEvent, getPermission, getEmployeesByStatus, getEventIpAddress, getEmployeeName, getStatusIcon } from '../../../../functions'
import { arrayUnion } from "firebase/firestore";
import tailwind from '../../../constants/tailwind'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS, ROUTES } from '../../..'
import { TimePickerModal, DatePickerModal, registerTranslation, useTheme } from 'react-native-paper-dates'
import { ListItem, Avatar, BottomSheet } from '@rneui/themed';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useNavigation } from '@react-navigation/native';

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
    const navigation = useNavigation();
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
    const [prevEvents, setPrevEvents] = useState()
    const [hasAttendedAs, setHasAttendedAs] = useState('')
    const [icon, setIcon] = useState('')
    const [bgStatus, setBgStatus] = useState(COLORS.primary)
    useEffect(() => {
        getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
        getEmployeesByStatus('0').then(res => setInactiveEmps(res))
        getEmployeesByStatus('2').then(res => setLeaveEmps(res))
        getEmployeesByStatus('3').then(res => setSickEmps(res))
        getEventIpAddress(currentEvent['id']).then(res => setEventIpAddress(res))
        getPrevEvents()
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
            .where('hasEnded', '==', false)
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
                            createdBy: docSnapshot.data()['createdBy']
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

    const getPrevEvents = () => {
        firebase.firestore()
            .collection('events')
            .where('hasEnded', '==', true)
            .orderBy('end', 'desc')
            .onSnapshot({
                next: querySnapshot => {
                    const res = querySnapshot.docs.map(docSnapshot => (
                        {
                            id: docSnapshot.id,
                            title: docSnapshot.data()['title'],
                            startDate: docSnapshot.data()['start'],
                            totalAttendance: docSnapshot.data()['attendance'].length + docSnapshot.data()['absent'].length + docSnapshot.data()['sick_leave'].length + docSnapshot.data()['annual_leave'].length,
                            createdBy: docSnapshot.data()['createdBy'],
                        }
                    ))
                    setPrevEvents(res)
                }
            })
    }

    const Item = ({ title, startDate, totalAttendance, createdBy }) => {
        const [creator, setCreator] = useState('')
        getEmployeeName(createdBy).then(res => setCreator(res))
        return (
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CHART)}>
                <View className={`d-flex flex-row mx-5 my-1 bg-[#fff] rounded-2xl`}>
                    <View className={`bg-[${COLORS.primary}] p-1 d-flex justify-center w-2/12 rounded-2xl`}>
                        <Text className={`font-medium text-3xl text-[#fff] text-center m-auto`}>{format(new Date(startDate), 'dd')}</Text>
                        <Text className={`font-medium text-xl text-[#fff] text-center m-auto`}>{format(new Date(startDate), 'MMM').toUpperCase()}</Text>
                    </View>
                    <View className={`py-1 px-2 d-flex justify-center`}>
                        <View>
                            <Text className={`${tailwind.titleText} font-medium text-xl text-[#7E7E7E]`}> {title}</Text>
                        </View>
                        <View className={`d-flex flex-row`}>
                            <Text className={`${tailwind.slogan} text-base text-[#7E7E7E] mr-4`}> <Icon name={'time'} size={15} color={COLORS.grey} /> {format(new Date(startDate), 'HH:mm')}</Text>
                            <Text className={`${tailwind.slogan} text-base text-[#7E7E7E] mr-4`}> <Icon name={'people'} size={20} color={COLORS.grey} /> {totalAttendance}</Text>
                            <Text className={`${tailwind.slogan} text-base text-[#7E7E7E]`}> <Icon name={'person'} size={15} color={COLORS.grey} /> {creator} </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    const getAttendance = () => {
        firebase.firestore()
            .collection('events')
            .doc(currentEvent['id'])
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.data()['attendance'].includes(props.empId) || documentSnapshot.data()['absent'].includes(props.empId) || documentSnapshot.data()['sick_leave'].includes(props.empId) || documentSnapshot.data()['annual_leave'].includes(props.empId)) {
                    setLoading(false)
                    setHasAttended(true)
                    if (documentSnapshot.data()['attendance'].includes(props.empId)) {
                        setHasAttendedAs('attendance')
                        setBgStatus(COLORS.blue900)
                    } else if (documentSnapshot.data()['absent'].includes(props.empId)) {
                        setHasAttendedAs('absent')
                        setBgStatus(COLORS.blueA700)
                    } else if (documentSnapshot.data()['sick_leave'].includes(props.empId)) {
                        setHasAttendedAs('sick_leave')
                        setBgStatus(COLORS.primary)
                    } else if (documentSnapshot.data()['annual_leave'].includes(props.empId)) {
                        setHasAttendedAs('annual_leave')
                        setBgStatus(COLORS.lightblue700)
                    }
                    getStatusIcon(hasAttendedAs).then(res => setIcon(res))
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
    console.log(bgStatus, COLORS.primary)
    return (
        <>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  >
                    <View className="items-center px-4 w-full">
                        {(currentEventVisible && currentEvent) ? (
                            <>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <Text className={`${tailwind.titleText} text-[${COLORS.grey}] mb-2 mt-2`}>Latest event</Text>
                                    <View className={`${tailwind.viewWrapper} bg-[${bgStatus}] rounded-2xl p-6`}>
                                        {permission == 'Admin' || permission == 'Super Admin' ? (
                                            <>
                                                <Text className={`${tailwind.slogan} text-white text-center text-3xl`}>{currentEvent['title']}</Text>
                                                <View className="flex-row justify-center  text-center mb-3 ">
                                                    <Icon name="location-outline" size={20} color={COLORS.white} className="pr-5" />
                                                    <Text className={`${tailwind.slogan} text-white`}>{locationName}</Text>
                                                </View>
                                                <Text className={`${tailwind.titleText} font-light text-white text-center  text-3xl`}>Session Code:</Text>
                                                <Text className={`${tailwind.titleText} tracking-widest text-white text-5xl text-center mb-3`}>{currentEvent['code']}</Text>
                                                <Text className={`${tailwind.slogan} text-white text-center  mb-3`}>Expire {currentEvent['end']}</Text>
                                                {currentEvent['createdBy'] === firebase.auth().currentUser?.email ? (
                                                    <TouchableOpacity className={`${tailwind.buttonWhite} w-12/12`} onPress={() => { alertCancelEvent(currentEvent['id']), getCurrentEvent() }}>
                                                        <Text className={`${tailwind.buttonBlueText}`}>Cancel Event</Text>
                                                    </TouchableOpacity>
                                                ) : null}

                                            </>
                                        ) : (
                                            <>
                                                {loading ?
                                                    <>
                                                        <Text className={`${tailwind.titleText} font-light text-white text-center my-6`}>Checking attendance</Text>
                                                        <ActivityIndicator size={100} color={COLORS.white} />

                                                    </>
                                                    :
                                                    <>
                                                        {hasAttended ?
                                                            <>
                                                                <Text className={`${tailwind.titleText} font-light text-white text-center my-3`}>Attendance recorded as {hasAttendedAs}</Text>
                                                                <View className="flex-row align-items-center justify-center">
                                                                    <Avatar size={200} icon={{ name: icon, type: "material" }} />
                                                                </View>
                                                            </>
                                                            :
                                                            <>
                                                                <Text className={`${tailwind.slogan}  text-3xl text-white text-center mt-4`}>{currentEvent['title']}</Text>
                                                                <Text className={`${tailwind.slogan} text-white text-center my-3`}>Expire at {currentEvent['end']}</Text>
                                                                <View className={`w-12/12 h-20 m-auto`}>
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
                                                                        codeInputHighlightStyle={{ borderColor: COLORS.secondary }}
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
                        {(permission == 'Admin' || permission == 'Super Admin') && currentEvent.length == 0 ? (
                            <View className={`${tailwind.viewWrapper}`}>
                                <Text className={`${tailwind.titleText} text-[${COLORS.grey}] mb-2  mt-2`}>Create a new session</Text>
                                <View className={`${tailwind.viewWrapper} bg-[${COLORS.primary}] rounded-2xl p-6`}>
                                    <View className={` w-12/12 mb-3`}>
                                        <SelectList
                                            data={locations}
                                            setSelected={setSelectedLocation}
                                            placeholder='Select Location'
                                            placeholderTextColor={COLORS.placeHolder}
                                            inputStyles={{
                                                color: "#666",
                                                padding: 0,
                                                margin: 0,
                                            }}
                                            boxStyles={{
                                                borderRadius: 15,
                                                borderColor: COLORS.white,
                                                color: COLORS.white,
                                                backgroundColor: COLORS.white
                                            }}
                                            dropdownStyles={{
                                                borderWidth: 1,
                                                borderRadius: 4,
                                                borderColor: COLORS.lightGrey,
                                                backgroundColor: COLORS.lightGrey,
                                                color: COLORS.white,
                                                marginLeft: 5,
                                                marginRight: 5,
                                                marginBottom: 5,
                                                marginTop: 0,
                                                position: 'relative'
                                            }}
                                        />
                                    </View>
                                    <TextInput
                                        className={`${tailwind.inputs} w-12/12 mb-3`}
                                        value={title}
                                        placeholder={'Event title'}
                                        onChangeText={(text) => setTitle(text)}
                                        autoCorrect={false}
                                        placeholderTextColor={COLORS.placeHolder}
                                    />
                                    <TextInput
                                        className={`${tailwind.inputs} w-12/12 mb-3`}
                                        value={`From now ${format(new Date(), 'dd-MMM-yy HH:mm')}`}
                                        editable={false}
                                    />
                                    <View className={`${tailwind.viewWrapper} flex-column mb-3`}>
                                        <View className={`flex-row justify-between w-12/12`}>
                                            <TouchableOpacity className={`bg-white rounded-2xl w-[48%]`} onPress={() => setDatePickerVisible(true)}>
                                                <View className="pl-[10] flex-row align-items-center my-3">
                                                    <Icon name="calendar" size={20} color={COLORS.primary} className={`text-[${COLORS.placeHolder}] ml-3`} />
                                                    <Text className={`text-[${COLORS.placeHolder}] ml-3 my-auto`}>{date == undefined ? 'Until date' : format(date, 'dd-MMM-yy')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity className={`bg-white rounded-2xl w-[48%]`} onPress={() => setTimePickerVisible(true)}>
                                                <View className="pl-[10] flex-row align-items-center my-3">
                                                    <Icon name="time" size={20} color={COLORS.primary} className={`text-[${COLORS.placeHolder}] ml-3`} />
                                                    <Text className={`text-[${COLORS.placeHolder}]  ml-3 my-auto`}>{time == undefined ? 'Until time' : time}</Text>
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
                                            validRange={{
                                                startDate: new Date()
                                            }}

                                        />
                                        <TimePickerModal
                                            label='This'
                                            visible={timePickerVisible}
                                            onDismiss={onDismissTime}
                                            hours={format(new Date, 'H')}
                                            minutes={format(new Date, 'mm')}
                                            onConfirm={onConfirmTime}
                                            use24HourClock={true}
                                        />
                                    </View>
                                    <TouchableOpacity className={`${tailwind.buttonWhite}`}
                                        onPress={() => {
                                            hanldeCreateEvent(selectedLocation, title, date, time, inactiveEmps, sickEmps, leaveEmps, firebase.auth().currentUser?.email), getCurrentEvent()
                                        }}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Create Event</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                    </View>
                    <Text className={`${tailwind.titleText} text-[${COLORS.grey}] mb-2 ml-5`}>Previous events</Text>
                    <FlatList
                        data={prevEvents}
                        renderItem={({ item }) => <Item title={item.title} startDate={item.startDate} totalAttendance={item.totalAttendance} createdBy={item.createdBy} />}
                        keyExtractor={item => item.id}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
        </>
    )
}

export default Event
