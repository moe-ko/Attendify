import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Alert, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator, Platform, FlatList } from 'react-native'
import { firebase } from '../../../../config'
import { format } from 'date-fns'
import { getLocationName, getLocations, hanldeCreateEvent, alertCancelEvent, getPermission, getEmployeesByStatus, getEventIpAddress, getStatusIcon, finishEvent, getEmployeeName, getCurrentEmployeeStatus } from '../../../../functions'
import { arrayUnion } from "firebase/firestore";
import tailwind from '../../../constants/tailwind'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS, ROUTES } from '../../..'
import { Avatar } from '@rneui/themed';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import CountDownTimer from 'react-native-countdown-timer-hooks';

const Event = ({ props }) => {
    const navigation = useNavigation();
    const [locations, setLocations] = useState('');
    const [title, setTitle] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState('');
    const [currentEvent, setCurrentEvent] = useState([]);
    const [locationName, setLocationName] = useState();
    const [code, setCode] = useState()
    const [hasAttended, setHasAttended] = useState(false)
    const [permission, setPermission] = useState('');
    const [loading, setLoading] = useState(true)
    const [sickEmps, setSickEmps] = useState([])
    const [leaveEmps, setLeaveEmps] = useState([])
    const [eventIpAddress, setEventIpAddress] = useState('')
    const [prevEvents, setPrevEvents] = useState([])
    const [hasAttendedAs, setHasAttendedAs] = useState('')
    const [icon, setIcon] = useState('')
    const [bgStatus, setBgStatus] = useState(COLORS.primary)
    const [timer, setTimer] = useState(0)
    const [timerSelected, setTimerSelected] = useState(0)
    const refTimer = useRef();
    // For keeping a track on the Timer
    const [timerEnd, setTimerEnd] = useState(false);

    const [myStatusId, setMyStatusId] = useState()

    useEffect(() => {
        getPermission(firebase.auth().currentUser?.email).then(res => setPermission(res))
        getCurrentEmployeeStatus(firebase.auth().currentUser?.email).then(res => setMyStatusId(res))
        getEmployeesByStatus('2').then(res => setLeaveEmps(res))
        getEmployeesByStatus('3').then(res => setSickEmps(res))
        getEventIpAddress(currentEvent['id']).then(res => setEventIpAddress(res))
        getPrevEvents()

    }, [permission, eventIpAddress])

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
                        checkTimer(res[0]['end'])
                    } else {
                        setCurrentEvent('')
                    }
                }
            })
    }

    const checkTimer = (end) => {
        const now = new Date().getTime() / 1000;
        const res = Math.trunc(end - now);
        setTimer(res)
    }

    const timerCallbackFunc = (timerFlag) => {
        // Setting timer flag to finished
        setTimerEnd(timerFlag);
        finishEvent(currentEvent['id'])
    };

    const getPrevEvents = () => {
        firebase.firestore()
            .collection('events')
            .where('hasEnded', '==', true)
            .onSnapshot({
                next: querySnapshot => {
                    const res = querySnapshot.docs.map(docSnapshot => (
                        {
                            id: docSnapshot.id,
                            title: docSnapshot.data()['title'],
                            startDate: docSnapshot.data()['start'],
                            totalAttendance: docSnapshot.data()['attendance'].length,
                            location: docSnapshot.data()['location'],
                            createdBy: docSnapshot.data()['createdBy'],
                        }
                    ))
                    setPrevEvents(res)
                }
            })
    }

    const Item = ({ id, title, startDate, totalAttendance, createdBy }) => {
        const [creator, setCreator] = useState('')
        useEffect(() => {
            getEmployeeName(createdBy).then(res => {
                res = res.split(' ')
                setCreator(res[0])
            })
        }, [creator])

        return (
            <>
                {permission == 'Admin' || permission == 'Super Admin' ? (
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CHART)}>
                        <ItemContent props={{ id, title, startDate, totalAttendance, createdBy }} />
                    </TouchableOpacity>
                ) : (
                    <ItemContent props={{ id, title, startDate, totalAttendance, createdBy }} />
                )}
            </>

        )
    };

    ItemContent = ({ props }) => {
        return (
            <View className={`d-flex flex-row mx-4 my-2 bg-[#fff] rounded-2xl drop-shadow-xl justify-between`} style={{
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
            }}>
                <View className={`w-9/12 d-flex flex-row w-10/12`}>
                    <View className={`bg-[${COLORS.primary}] p-1 d-flex justify-center w-2/12 rounded-2xl`}>
                        <Text className={`font-medium text-3xl text-[#fff] text-center m-auto`}>{format(new Date(props.startDate), 'dd')}</Text>
                        <Text className={`font-medium text-xl text-[#fff] text-center m-auto`}>{format(new Date(props.startDate), 'MMM').toUpperCase()}</Text>
                    </View>
                    <View className={`py-1 px-2 d-flex justify-center w-10/12`}>
                        <View>
                            <Text numberOfLines={1} className={`${tailwind.titleText} font-medium text-xl text-[#7E7E7E] truncate `}> {props.title}</Text>
                        </View>
                        <View className={`d-flex flex-row`}>
                            <Text className={`${tailwind.slogan} text-base text-[#7E7E7E] mr-4`}> <Icon name={'time'} size={15} color={COLORS.primary} /> {format(new Date(props.startDate), 'HH:mm')}</Text>
                            <Text className={`${tailwind.slogan} text-base text-[#7E7E7E] mr-4`}> <Icon name={'people'} size={20} color={COLORS.primary} /> {props.totalAttendance}</Text>
                            {/* <Text className={`${tailwind.slogan} text-base text-[#7E7E7E] mr-4`}> <Icon name={'person'} size={15} color={COLORS.grey} /> {createdBy === firebase.auth().currentUser?.email ? 'Me' : creator}</Text> */}
                        </View>
                    </View>
                </View>
                {props.createdBy === firebase.auth().currentUser?.email ? (
                    <TouchableOpacity className={`text-center m-auto `} onPress={() => { alertCancelEvent(props.id); getCurrentEvent() }}>
                        <Icon name="trash-outline" size={30} color={'#FF0000'} className={``} />
                    </TouchableOpacity>
                ) : null}
            </View>
        )

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

    const checkEventIp = (code, eventId) => {
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
                    <View className={`items-center px-4 w-full`}>
                        {currentEvent ? (
                            <>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <Text className={`${tailwind.titleText} text-[${COLORS.grey}] mb-2 mt-2`}>Latest event</Text>
                                    <View style={{ backgroundColor: bgStatus }} className={`${tailwind.viewWrapper} rounded-2xl p-6`}>
                                        {permission == 'Admin' || permission == 'Super Admin' ? (
                                            <>
                                                <Text className={`${tailwind.slogan} text-white text-center text-3xl`}>{currentEvent['title']}</Text>
                                                <Text className={`${tailwind.slogan} text-white text-center mb-3`}>{locationName}</Text>
                                                <Text className={`${tailwind.titleText} font-light text-white text-center  text-3xl`}>Session Code:</Text>
                                                <Text className={`${tailwind.titleText} tracking-widest text-white text-5xl text-center mb-3`}>{currentEvent['code']}</Text>
                                                <Text className={`${tailwind.slogan} text-white text-center`}>Expires in</Text>
                                                <CountDownTimer
                                                    ref={refTimer}
                                                    timestamp={timer}
                                                    timerCallback={timerCallbackFunc}
                                                    containerStyle={{
                                                        height: 'auto',
                                                        width: '100%',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 35,
                                                        backgroundColor: COLORS.primary,
                                                    }}
                                                    textStyle={{
                                                        fontSize: 35,
                                                        color: COLORS.white,
                                                        fontWeight: 'bold',
                                                        letterSpacing: 10,
                                                    }}
                                                />
                                                {currentEvent['createdBy'] === firebase.auth().currentUser?.email ? (
                                                    <TouchableOpacity className={`${tailwind.buttonWhite} w-12/12 mt-4`} onPress={() => { alertCancelEvent(currentEvent['id']); getCurrentEvent() }}>
                                                        <Text className={`${tailwind.buttonBlueText} text-[#FF0000]`}>Cancel</Text>
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
                                                                <Text className={`${tailwind.titleText} font-light text-white text-center my-3`}>Attendance recorded as {hasAttendedAs == 'attendance' ? 'Attended, thank you for coming!' : hasAttendedAs == 'absent' ? 'Absent, we missed you!' : hasAttendedAs == 'sick_leave' ? 'Sick Leave, get well soon!' : 'Holiday, have a great time!'}</Text>
                                                                <View className="flex-row align-items-center justify-center">
                                                                    <Avatar size={200} icon={{ name: icon, type: "material" }} />
                                                                </View>
                                                            </>
                                                            :
                                                            <>
                                                                <Text className={`${tailwind.slogan}  text-3xl text-white text-center mt-4`}>{currentEvent['title']}</Text>
                                                                <Text className={`${tailwind.slogan} text-white text-center mb-3`}>{locationName}</Text>
                                                                <Text className={`${tailwind.slogan} text-white text-center my-3`}>Expires in</Text>
                                                                <CountDownTimer
                                                                    ref={refTimer}
                                                                    timestamp={timer}
                                                                    timerCallback={timerCallbackFunc}
                                                                    containerStyle={{
                                                                        height: 'auto',
                                                                        width: '100%',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        borderRadius: 35,
                                                                        backgroundColor: COLORS.primary,
                                                                    }}
                                                                    textStyle={{
                                                                        fontSize: 35,
                                                                        color: COLORS.white,
                                                                        fontWeight: 'bold',
                                                                        letterSpacing: 10,
                                                                    }}
                                                                />
                                                                {myStatusId == 0 ?
                                                                    <View className={`bg-[#FF0000] p-3 my-2 rounded-2xl`}
                                                                        style={{
                                                                            shadowColor: '#000',
                                                                            shadowOffset: {
                                                                                width: 0,
                                                                                height: 2,
                                                                            },
                                                                            shadowOpacity: 0.25,
                                                                            shadowRadius: 4,
                                                                            elevation: 5,
                                                                            zIndex: 3,
                                                                            alignItems: 'center'
                                                                        }}
                                                                    >
                                                                        <Text className={`${tailwind.slogan} text-white text-center font-bold`}>Your account is inactive, please contact your manager to attend this meeting</Text>
                                                                    </View>

                                                                    :
                                                                    <>
                                                                        <Text className={`${tailwind.slogan} text-white text-center mt-3`}>Enter code</Text>
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
                                                                                onCodeFilled={code => { setCode(code) }}
                                                                            />
                                                                        </View>
                                                                        <TouchableOpacity
                                                                            className={`${tailwind.buttonWhite} w-10/12 m-auto mt-3 mb-5`}
                                                                            onPress={() => { checkEventIp(code, currentEvent['id']) }}
                                                                        >
                                                                            <Text className={`${tailwind.buttonBlueText}`}>Attendify</Text>
                                                                        </TouchableOpacity>
                                                                    </>}

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
                        {(permission == 'Admin' || permission == 'Super Admin') && currentEvent.length == 0 ? (
                            <View className={`${tailwind.viewWrapper}`}>
                                <Text className={`${tailwind.titleText} text-[${COLORS.grey}] mb-2  mt-2 pb-2`}>Create a new session</Text>
                                <View className={`${tailwind.viewWrapper} bg-[${COLORS.primary}] rounded-2xl p-6`}>
                                    <RNPickerSelect
                                        onValueChange={(value) => setSelectedLocation(value)}
                                        placeholder={{ label: 'Select location...' }}
                                        style={{
                                            inputIOS: {
                                                paddingHorizontal: 15,
                                                paddingVertical: 15,
                                                backgroundColor: COLORS.white,
                                                borderRadius: 15,
                                                borderColor: COLORS.white,
                                                color: 'black',
                                                marginBottom: 15
                                            },
                                            placeholder: {
                                                color: COLORS.placeHolder,
                                            },
                                            inputAndroid: {
                                                paddingHorizontal: 15,
                                                paddingVertical: 15,
                                                backgroundColor: COLORS.white,
                                                borderRadius: 15,
                                                borderColor: COLORS.white,
                                                color: 'black',
                                                marginBottom: 15
                                            },
                                        }}
                                        items={locations}
                                    />
                                    <TextInput
                                        className={`${tailwind.inputs} w-12/12 mb-3`}
                                        value={title}
                                        placeholder={'Event title'}
                                        onChangeText={(text) => setTitle(text)}
                                        autoCorrect={false}
                                        placeholderTextColor={COLORS.placeHolder}
                                    />
                                    <RNPickerSelect
                                        onValueChange={(value) => setTimerSelected(value)}
                                        placeholder={{ label: 'Select timer...' }}
                                        style={{
                                            inputIOS: {
                                                paddingHorizontal: 15,
                                                paddingVertical: 15,
                                                backgroundColor: COLORS.white,
                                                borderRadius: 15,
                                                borderColor: COLORS.white,
                                                color: 'black',
                                                marginBottom: 15
                                            },
                                            placeholder: {
                                                color: COLORS.placeHolder,
                                            },
                                            inputAndroid: {
                                                paddingHorizontal: 15,
                                                paddingVertical: 15,
                                                backgroundColor: COLORS.white,
                                                borderRadius: 15,
                                                borderColor: COLORS.white,
                                                color: 'black',
                                                marginBottom: 15
                                            },
                                        }}
                                        items={[
                                            { label: '2 mins', value: 120 },
                                            { label: '5 mins', value: 300 },
                                            { label: '10 mins', value: 600 },
                                            { label: '15 mins', value: 900 },
                                            { label: '30 mins', value: 1800 },
                                            { label: '60 mins', value: 3600 },
                                        ]}
                                    />
                                    <TouchableOpacity className={`${tailwind.buttonWhite}`}
                                        onPress={() => {
                                            hanldeCreateEvent(selectedLocation, title, sickEmps, leaveEmps, firebase.auth().currentUser?.email, props.ipAddress, timerSelected); getCurrentEvent(); setTimer(timerSelected)
                                        }}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Create Event</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                    </View>
                    {prevEvents.length > 0 ? (
                        <>
                            <Text className={`${tailwind.titleText} text-[${COLORS.grey}] mb-2 ml-5`}>Previous events</Text>
                            <FlatList
                                marginBottom={200}
                                data={prevEvents}
                                renderItem={({ item }) => <Item id={item.id} title={item.title} startDate={item.startDate} totalAttendance={item.totalAttendance} location={item.location} createdBy={item.createdBy} />}
                                keyExtractor={item => item.id}
                            />
                        </>
                    ) : null}
                </KeyboardAvoidingView>
            </ScrollView>
        </>
    )
}

export default Event
