import React, { useState, useEffect, Suspense } from 'react'
import {
    View,
    Text,
    Button,
    Alert,
    TextInput,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet
    

} from 'react-native'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { format } from 'date-fns'
import { getLocationName, getLocations, hanldeCreateEvent, alertCancelEvent } from '../../../../functions'
// import DateTimePicker from '@react-native-community/datetimepicker';
import { arrayUnion } from "firebase/firestore";
//import RNDateTimePicker from '@react-native-community/datetimepicker';
import PieChart from './Chart'
import tailwind from '../../../constants/tailwind'
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePickerModal from '@react-native-community/datetimepicker';



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
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        // getEmployees()
    })

    const handleDateChange = (event, newDate) => {
        if (newDate !== undefined) {
            setDate(newDate);
        }
        setShowDatePicker(false);
    };

    const showPicker = () => {
        setShowDatePicker(true);
    };


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

        <ScrollView>
            <KeyboardAvoidingView>
                <View>
                    {(currentEventVisible && currentEvent) ? (
                        <View>

                            <View>
                                <View className="flex-row mt-4">
                                    <Icon name="location-outline" size={30} color="#62ABEF" className="pr-5" />
                                    <Text className={`${tailwind.inputs} text-xl text-[#BBBBBB]`}>
                                        {locationName}</Text>
                                </View>

                                <Text className="text-2xl text-[#7E7E7E] mx-5">Happening now</Text>
                            </View>

                            <View >
                                <View className={`${tailwind.viewWrapper} bg-[#62ABEF] rounded-2xl w-11/12 h-72 mx-5`}>
                                    <View className="my-5 justify-center items-center">
                                        
                                        <Text className="text-white text-xl shadow-md">Session Code:</Text>
                                        <Text className="text-white text-2xl">{currentEvent['code']}</Text>
                                        <Text className="text-white">Expire {currentEvent['end']}</Text>
                                        <Text className="text-white">in {hrs}:{mins}:{secs}</Text>

                                        <TextInput
                                            className={`${tailwind.inputs} w-80 mx-20 my-3`}
                                            value={code}
                                            placeholder='Enter event code'
                                            onChangeText={(text) => setCode(text)}
                                            autoCorrect={false}
                                            required
                                        // placeholderTextColor="#666"
                                        />

                                        <TouchableOpacity
                                            className="p-[10] w-80 bg-white my-2 rounded-2xl justify-center items-center shadow-md"
                                            onPress={() => {
                                                alertCancelEvent(currentEvent['id']), getCurrentEvent()
                                            }}>
                                            <Text className={`${tailwind.buttonBlueText}`} >Cancel</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                {/* {hasAttended ? <Text>Thank you for attending</Text> : */}
                                <View>

                                    <View className="justify-center items-center">
                                        <TouchableOpacity className={`${tailwind.buttonBlue} w-80 mb-4`}
                                            onPress={() => {
                                                handleAttendify(code, currentEvent['id'])
                                            }}
                                        >
                                            <View>
                                                <Text className={`${tailwind.buttonWhiteText}`}>Attendify</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="justify-center items-center">
                                        <Text>Thank you for attending</Text>
                                    </View>
                                </View>
                                {/* } */}
                            </View >
                        </View>
                    ) : null}
                    {/* {(createEventVisible) ? ( */}
                    <View>
                        <View>
                            <Text className="text-2xl text-[#7E7E7E] mx-5 my-5">Create a new session</Text>
                        </View>
                        <View className={`${tailwind.container} bg-[#62ABEF] rounded-2xl w-11/12 h-52 mx-5 mb-5`}>
                            <View className={`${tailwind.viewWrapper} w-80 my-5 mx-5`}>
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
                                        // borderWidth: 1,
                                        borderRadius: 15,
                                        //height:'50%',
                                        borderColor: '#fff',
                                        color: '#fff',
                                        // margin: 5,
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
                            <View className={`${tailwind.viewWrapper}`}>
                                <TextInput
                                    className={`${tailwind.inputs} p-[10] w-80  mx-5`}
                                    // placeholder="Bench Enablement Program"
                                    //autoCapitalize='none'
                                    //autoCorrect={false}                                   
                                    value={title}
                                    placeholder={'Event title'}
                                    onChangeText={(text) => setTitle(text)}
                                    autoCorrect={false}

                                />

                            </View>
                            <View className={`${tailwind.viewWrapper} flex-row`}>
                                <TextInput
                                    className={`${tailwind.inputs} p-[10] w-80  mx-5`}
                                    placeholder="Date:"
                                />

                                <TouchableOpacity onPress={showPicker}>
                                    {/* <Text className="mx-[-250] text-[#726F6F]" style={{
                                        //borderWidth: 1,
                                        // borderColor: 'gray',
                                        padding: 5,
                                        borderRadius: 5,
                                        marginTop: 5,
                                    }}>
                                        {date.toLocaleDateString()}</Text> */}
                                </TouchableOpacity>
                                {/* <DateTimePickerModal
                                    value={date}
                                    isVisible={showDatePicker}
                                    mode="date"
                                    onConfirm={handleDateChange}
                                    onCancel={() => setShowDatePicker(false)}
                                    date={date}
                                /> */}

                            </View>

                          {/*  <View>
                                <RNDateTimePicker
                                    value={time}
                                    mode={'datetime'}
                                    display={Platform.OS === `ios` ? `default` : `default`}
                                    is24Hour={false}
                                    onChange={() => setTime(time)}
                                />

                            </View> */}
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

                    {/* ) : null} */}
                </View >
            </KeyboardAvoidingView>
        </ScrollView>
        
                        
                                
                     
            
          
           
    )

}
const styles = StyleSheet.create({

});


export default Event
