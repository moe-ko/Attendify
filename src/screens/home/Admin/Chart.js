import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native'
import { VictoryPie } from 'victory-native'
import { Svg } from 'react-native-svg'
import { COLORS, ROUTES } from '../../..'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { setDate } from 'date-fns'
import { ListItem, Avatar, BottomSheet } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'
import { arrayUnion } from 'firebase/firestore'
import tailwind from '../../../constants/tailwind'

const Chart = ({ navigation }) => {
    const [eventDate, setEventDate] = useState('')
    const [attend, setAttend] = useState(0)
    const [absent, setAbsent] = useState(0)
    const [sickLeave, setSickLeave] = useState(0)
    const [annualLeave, setAnnualLeave] = useState(0)
    const [totalAssitance, setTotalAssistance] = useState(0)
    const [viewDetails, setViewDetails] = useState(false)
    const [clear, setClear] = useState([])
    const [dates, setDates] = useState()
    const [employeeSelected, setEmployeeSelected] = useState('')
    const [currentStatus, setCurrentStatus] = useState('')
    const [isVisible, setIsVisible] = useState(false);
    const [eventExist, setEventExist] = useState(true)
    let employees = clear

    useEffect(() => {
        if (eventDate == '') {
            getCurrentEventDate()
        } else {
            getTotalAttendance()
        }
    }, [eventDate])

    getCurrentEventDate = async () => {
        firebase.firestore()
            .collection('events')
            .orderBy('end', 'desc')
            .onSnapshot({
                next: querySnapshot => {
                    const res = querySnapshot.docs.map(docSnapshot => ({ key: docSnapshot.data()['end'], value: docSnapshot.data()['end'] }))
                    if (res.length > 0) {
                        setEventDate(res[0]['key'])
                        setDates(res)
                        getTotalAttendance()
                        setEventExist(true)
                    } else {
                        setEventExist(false)
                    }
                }
            })
    }

    getTotalAttendance = () => {
        const conn = firebase.firestore()
            .collection('events')
            .where('end', '==', eventDate)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    let data = documentSnapshot.data()
                    const attendance = data['attendance'].length
                    const absent = data['absent'].length
                    const sl = data['sick_leave'].length
                    const al = data['annual_leave'].length
                    setClear([])
                    if (attendance == 0 && absent == 0 && sl == 0 && al == 0) {
                        setViewDetails(false)
                    } else {
                        setAttend(attendance)
                        setAbsent(absent)
                        setSickLeave(sl)
                        setAnnualLeave(al)
                        setTotalAssistance(attendance + absent + sl + al)
                        setViewDetails(true)
                        attendance > 0 ? getData(data, 'attendance') : null
                        absent > 0 ? getData(data, 'absent') : null
                        sl > 0 ? getData(data, 'sick_leave') : null
                        al > 0 ? getData(data, 'annual_leave') : null
                    }
                });
            });
        return () => conn()
    }

    getData = (data, field) => {
        data[field].forEach(id => {
            return employeeDetails(id, field)
        })
    }

    employeeDetails = (id, status) => {
        const subscriber = firebase.firestore()
            .collection('employees')
            .doc(id)
            .onSnapshot(documentSnapshot => {
                employees.push({ id: id, name: `${documentSnapshot.data()['full_name']}`, avatar: `${documentSnapshot.data()['avatar']}`, status: status })
            });
        return () => subscriber();
    }

    const attendPercent = Math.round(attend / totalAssitance * 100)
    const absentPercent = Math.round(absent / totalAssitance * 100)
    const slPercent = Math.round(sickLeave / totalAssitance * 100)
    const alPercent = Math.round(annualLeave / totalAssitance * 100)

    const statusIcon = (status) => {
        let icon = ''
        switch (status) {
            case 'attendance':
                icon = 'checkmark'
                break;
            case 'absent':
                icon = 'close'
                break;
            case 'sick_leave':
                icon = 'pulse-outline'
                break;
            case 'annual_leave':
                icon = 'rocket-outline'
                break;
        }
        return icon
    }

    const graphicData = [
        { x: `${attendPercent}%`, y: attendPercent },
        { x: `${absentPercent}%`, y: absentPercent },
        { x: `${slPercent}%`, y: slPercent },
        { x: `${alPercent}%`, y: alPercent },
    ]

    Item = ({ id, name, avatar, status }) => {
        return (
            <ListItem.Swipeable bottomDivider rightWidth={90} minSlideWidth={10} rightContent={() => (
                <TouchableOpacity
                    style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex', backgroundColor: COLORS.primary, height: '100%' }}
                    onPress={() => { setIsVisible(true), setEmployeeSelected(id), setCurrentStatus(status) }}>
                    <Icon name="ellipsis-horizontal" size={30} color={COLORS.white} />
                    <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 'bold' }}>More</Text>
                </TouchableOpacity>
            )}>
                <Avatar rounded size={50} source={{ uri: `${avatar}` }} />
                <ListItem.Content>
                    <ListItem.Title className={`${tailwind.titleText} font-medium text-xl text-[${COLORS.grey}]`}>{name}</ListItem.Title>
                    <ListItem.Subtitle className={`${tailwind.slogan} text-base text-[${COLORS.grey}]`}>{id}</ListItem.Subtitle>
                </ListItem.Content>
                <Icon name={statusIcon(status)} size={30} color={COLORS.primary} />
                <ListItem.Chevron />
            </ListItem.Swipeable>
        )
    }

    BoxInfo = ({ bg, label, status }) => (
        <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'column', display: 'flex', width: '100%' }}>
            <View style={{ width: '90%', padding: 2, borderRadius: 4, marginTop: 8, backgroundColor: `${bg}`, alignItems: 'center', }}>
                <Icon name={statusIcon(status)} size={20} color={COLORS.secondary} fontWeight='bold' />
                <Text style={{ fontSize: 16, fontWeight: 600, text: 'center', color: COLORS.secondary }}>
                    {label}
                </Text>
            </View>
        </View>
    );

    const bottomSheetList = [
        {
            title: 'Attend',
            icon: statusIcon('attendance'),
            containerStyle: { backgroundColor: currentStatus == 'attendance' ? COLORS.lightblue500 : 'white', marginHorizontal: 15, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
            onPress: () => { currentStatus == 'attendance' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'attendance') }
        },
        {
            title: 'Absent',
            icon: statusIcon('absent'),
            containerStyle: { backgroundColor: currentStatus == 'absent' ? COLORS.lightblue500 : 'white', marginHorizontal: 15 },
            onPress: () => { currentStatus == 'absent' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'absent') }
        },
        {
            title: 'Sick',
            icon: statusIcon('sick_leave'),
            containerStyle: { backgroundColor: currentStatus == 'sick_leave' ? COLORS.lightblue500 : 'white', marginHorizontal: 15 },
            onPress: () => { currentStatus == 'sick_leave' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'sick_leave') }
        },
        {
            title: 'Holiday',
            icon: statusIcon('annual_leave'),
            containerStyle: { backgroundColor: currentStatus == 'annual_leave' ? COLORS.lightblue500 : 'white', marginHorizontal: 15, marginBottom: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
            onPress: () => { currentStatus == 'annual_leave' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'annual_leave') }
        },
        { title: 'Cancel', icon: 'arrow-down', containerStyle: { marginBottom: 30, padding: 20, marginHorizontal: 15, borderRadius: 20 }, onPress: () => setIsVisible(false) },
    ];

    updateEmployeeStatus = (employeeSelected, currentStatus, newStatus) => {
        firebase.firestore()
            .collection('events')
            .where('end', '==', eventDate)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    let employees = []
                    switch (currentStatus) {
                        case 'attendance':
                            employees = documentSnapshot.data()['attendance']
                            break;
                        case 'absent':
                            employees = documentSnapshot.data()['absent']
                            break;
                        case 'sick_leave':
                            employees = documentSnapshot.data()['sick_leave']
                            break;
                        case 'annual_leave':
                            employees = documentSnapshot.data()['annual_leave']
                            break;
                    }
                    let index = employees.indexOf(employeeSelected)
                    employees.splice(index, 1)
                    updateStatus(currentStatus, documentSnapshot.id, employees, employeeSelected, newStatus)
                });
            });
    }

    updateStatus = (currentStatus, id, newArray, employeeSelected, newStatus) => {
        let query = ''
        let union = arrayUnion(employeeSelected)
        switch (currentStatus) {
            case 'attendance':
                query = { attendance: newArray }
                break;
            case 'absent':
                query = { absent: newArray }
                break;
            case 'sick_leave':
                query = { sick_leave: newArray }
                break;
            case 'annual_leave':
                query = { annual_leave: newArray }
                break;
        }
        changeStatus(id, query)
        switch (newStatus) {
            case 'attendance':
                query = { attendance: union }
                break;
            case 'absent':
                query = { absent: union }
                break;
            case 'sick_leave':
                query = { sick_leave: union }
                break;
            case 'annual_leave':
                query = { annual_leave: union }
                break;
        }
        changeStatus(id, query)
        setIsVisible(false)
    }

    changeStatus = (id, query) => {
        firebase.firestore()
            .collection('events')
            .doc(id)
            .update(
                query
            )
    }

    return (
        <>
            {eventExist ? (
                <View>
                    <View className={`${tailwind.viewWrapper} bg-[${COLORS.white}] rounded-b-3xl items-center  py-4 px-6 justify-center`} style={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <View className={` w-screen px-3`}>
                            <SelectList
                                data={dates}
                                setSelected={selectedDate => { setEventDate(selectedDate), getTotalAttendance() }}
                                placeholder={eventDate}
                                placeholderTextColor={COLORS.placeHolder}
                                inputStyles={{
                                    color: "#666",
                                    padding: 7,
                                    margin: 0,
                                }}
                                boxStyles={{
                                    borderRadius: 20,
                                    color: 'black',
                                    backgroundColor: COLORS.whiteSmoke,
                                    borderColor: 'white',
                                }}
                                dropdownStyles={{
                                    borderWidth: 0,
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
                    </View>
                    {viewDetails ? (
                        <>
                            <ScrollView>
                                <VictoryPie
                                    data={graphicData}
                                    width={Dimensions.get('window').width}
                                    style={{ width: '100%', labels: { fill: "white", fontSize: 20, fontWeight: "light" } }}
                                    labelRadius={({ innerRadius }) => innerRadius + 60}
                                    innerRadius={20}
                                    colorScale={[COLORS.primary, COLORS.lightblue700, COLORS.lightblue600, COLORS.lightblue500]}
                                />
                                <View style={{ flex: 1, paddingHorizontal: 10, flexDirection: 'row', alignContent: 'space-between', marginBottom: 20 }}>
                                    <BoxInfo bg={COLORS.primary} label='Attend' status='attendance' />
                                    <BoxInfo bg={COLORS.lightblue700} label='Absent' status='absent' />
                                    <BoxInfo bg={COLORS.lightblue600} label='Sick' status='sick_leave' />
                                    <BoxInfo bg={COLORS.lightblue500} label='Holiday' status='annual_leave' />
                                </View>
                                <FlatList marginBottom={100}
                                    data={employees}
                                    renderItem={({ item }) => <Item id={item.id} name={item.name} avatar={item.avatar} status={item.status} />}
                                    keyExtractor={item => item.id}
                                />
                            </ScrollView>
                        </>
                    ) :
                        <View style={{
                            display: "flex",
                            alignItems: "center",
                            height: '100%',
                        }}>
                            <Image source={require('../../../../assets/empty.webp')} style={{ height: 200, width: '100%' }} />
                            <View className={`${tailwind.viewWrapper} px-4`}>
                                <Text className={`${tailwind.titleText} text-[${COLORS.grey}] text-center`}>No records found</Text>
                                <View className={`flex-row justify-center items-center`}>
                                    <Text className={`${tailwind.slogan} text-[${COLORS.grey}] text-center`} >No records found for {eventDate} </Text>
                                </View>
                            </View>
                        </View>
                    }
                    <BottomSheet isVisible={isVisible}>
                        {bottomSheetList.map((l, i) => (
                            <ListItem bottomDivider key={i} containerStyle={l.containerStyle} onPress={l.onPress} borderRadius='10'>
                                <Icon name={l.icon} size={30} color={COLORS.primary} />
                                <ListItem.Content>
                                    <ListItem.Title >{l.title}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </BottomSheet>
                </View >
            ) :
                <View style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: '100%',
                    backgroundColor: COLORS.lightGreyishBlue
                }}>
                    <Image source={require('../../../../assets/event-holder.webp')} style={{ height: 200, width: '100%' }} />
                    <View className={`${tailwind.viewWrapper} px-4`}>
                        <Text className={`${tailwind.titleText} text-[${COLORS.grey}] text-center`}>No events yet created</Text>
                        <View className={`flex-row justify-center items-center`}>
                            <Text className={`${tailwind.slogan} text-[${COLORS.grey}] text-center`} >Create a new event in the </Text>
                            <TouchableOpacity onPress={() => { navigation.navigate(ROUTES.HOME) }}>
                                <Text className={`${tailwind.slogan} ${tailwind.blueTextLink}`}> Dashboard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
        </>
    )
}

export default Chart