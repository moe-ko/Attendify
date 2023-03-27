import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { VictoryPie } from 'victory-native'
import { Svg } from 'react-native-svg'
import { COLORS } from '../../..'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { setDate } from 'date-fns'
import { ListItem, Avatar, BottomSheet } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'
import { arrayUnion } from 'firebase/firestore'

const Chart = () => {
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
    let employees = clear

    useEffect(() => {
        if (eventDate == '') {
            getCurrentEventDate()
        } else {
            getTotalAttendance(eventDate)
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
                        setDates(res)
                        getTotalAttendance(res[0]['key'])
                    }
                }
            })
    }

    getTotalAttendance = (date) => {
        firebase.firestore()
            .collection('events')
            .where('end', '==', date)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const attendance = documentSnapshot.data()['attendance'].length
                    const absent = documentSnapshot.data()['absent'].length
                    const sl = documentSnapshot.data()['sick_leave'].length
                    const al = documentSnapshot.data()['annual_leave'].length
                    setAttend(attendance)
                    setAbsent(absent)
                    setSickLeave(sl)
                    setAnnualLeave(al)
                    setTotalAssistance(attendance + absent + sl + al)
                    setViewDetails(true)
                    setClear([])
                    if (attendance > 0) {
                        documentSnapshot.data()['attendance'].forEach(id => {
                            return employeeDetails(id, 'attendance')
                        })
                    }
                    if (absent > 0) {
                        documentSnapshot.data()['absent'].forEach(id => {
                            return employeeDetails(id, 'absent')
                        })
                    }
                    if (sl > 0) {
                        documentSnapshot.data()['sick_leave'].forEach(id => {
                            return employeeDetails(id, 'sick_leave')
                        })
                    }
                    if (al > 0) {
                        documentSnapshot.data()['annual_leave'].forEach(id => {
                            return employeeDetails(id, 'annual_leave')
                        })
                    }
                });
            });
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

    const graphicData = [
        { x: `${attendPercent}%`, y: attendPercent },
        { x: `${absentPercent}%`, y: absentPercent },
        { x: `${slPercent}%`, y: slPercent },
        { x: `${alPercent}%`, y: alPercent }
    ]

    Item = ({ id, name, avatar, status }) => {
        let icon = ''
        if (status == 'attendance') {
            icon = 'checkmark'
        }
        if (status == 'absent') {
            icon = 'close'
        }
        if (status == 'sick_leave') {
            icon = 'pulse-outline'
        }
        if (status == 'annual_leave') {
            icon = 'rocket-outline'
        }
        return (
            <ListItem.Swipeable bottomDivider rightWidth={90} minSlideWidth={10} rightContent={(action) => (
                <TouchableOpacity
                    style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex', backgroundColor: '#62ABEF', height: '100%' }}
                    onPress={() => { setIsVisible(true), setEmployeeSelected(id), setCurrentStatus(status) }}>
                    <Icon name="ellipsis-horizontal" size={30} color="white" />
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>More</Text>
                </TouchableOpacity>
            )}>
                <Avatar rounded source={{ uri: `${avatar}` }} />
                <ListItem.Content>
                    <ListItem.Title>{name}</ListItem.Title>
                    <ListItem.Subtitle>{id}</ListItem.Subtitle>
                </ListItem.Content>
                <Icon name={icon} size={30} color={COLORS.primary} />
                <ListItem.Chevron />
            </ListItem.Swipeable>
        )
    }

    BoxInfo = ({ bg, label }) => (
        <View style={{ flex: 1, flexWrap: 'wrap', marginBottom: 5, flexDirection: 'column', display: 'flex', width: '100%' }}>
            <View style={{ width: '90%', padding: 8, borderRadius: 4, marginTop: 8, backgroundColor: `${bg}`, }}>
            </View>
            <View style={{ alignItems: 'center', text: 'center', margin: 'auto' }}>
                <Text style={{ fontSize: 16, fontWeight: 'light', text: 'center' }}>
                    {label}
                </Text>
            </View>
        </View>
    );

    const bottomSheetList = [
        {
            title: 'Attend',
            icon: 'checkmark',
            containerStyle: { backgroundColor: currentStatus == 'attendance' ? COLORS.lightblue500 : 'white' },
            onPress: () => { currentStatus == 'attendance' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'attendance') }
        },
        {
            title: 'Absent',
            icon: 'close',
            containerStyle: { backgroundColor: currentStatus == 'absent' ? COLORS.lightblue500 : 'white' },
            onPress: () => { currentStatus == 'absent' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'absent') }
        },
        {
            title: 'Sick',
            icon: 'pulse-outline',
            containerStyle: { backgroundColor: currentStatus == 'sick_leave' ? COLORS.lightblue500 : 'white' },
            onPress: () => { currentStatus == 'sick_leave' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'sick_leave') }
        },
        {
            title: 'Holiday',
            icon: 'rocket-outline',
            containerStyle: { backgroundColor: currentStatus == 'annual_leave' ? COLORS.lightblue500 : 'white' },
            onPress: () => { currentStatus == 'annual_leave' ? '' : updateEmployeeStatus(employeeSelected, currentStatus, 'annual_leave') }
        },
        { title: 'Cancel', containerStyle: { backgroundColor: 'red', paddingBottom: 30 }, titleStyle: { color: 'white' }, onPress: () => setIsVisible(false) },
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
                    updateStatus('from', currentStatus, documentSnapshot.id, employees, employeeSelected, newStatus)
                    updateStatus('to', currentStatus, documentSnapshot.id, employees, employeeSelected, newStatus)
                });
            });
    }

    updateStatus = (where, currentStatus, id, newArray, employeeSelected, newStatus) => {
        let query = ''
        let union = arrayUnion(employeeSelected)
        switch (currentStatus) {
            case 'attendance':
                query = { attendance: where == 'from' ? newArray : union }
                break;
            case 'absent':
                query = { absent: where == 'from' ? newArray : union }
                break;
            case 'sick_leave':
                query = { sick_leave: where == 'from' ? newArray : union }
                break;
            case 'annual_leave':
                query = { annual_leave: where == 'from' ? newArray : union }
                break;
        }

        firebase.firestore()
            .collection('events')
            .doc(id)
            .update(
                query
            )
        setIsVisible(false)
    }

    return (
        <View>
            <SelectList
                data={dates}
                setSelected={selectedDate => { setEventDate(selectedDate) }}
                placeholder={eventDate}
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
            {viewDetails ? (
                <>
                    <ScrollView marginBottom={50}>
                        <VictoryPie
                            data={graphicData}
                            width={Dimensions.get('window').width}
                            style={{ width: '100%', labels: { fill: "white", fontSize: 20, fontWeight: "light" } }}
                            labelRadius={({ innerRadius }) => innerRadius + 60}
                            innerRadius={20}
                            colorScale={[COLORS.primary, COLORS.lightblue700, COLORS.lightblue600, COLORS.lightblue500]}
                        />
                        <View style={{ flex: 1, paddingHorizontal: 10, flexDirection: 'row', alignContent: 'space-between', marginBottom: 20 }}>
                            <BoxInfo bg={COLORS.primary} label='Attend' />
                            <BoxInfo bg={COLORS.lightblue700} label='Absent' />
                            <BoxInfo bg={COLORS.lightblue600} label='Sick' />
                            <BoxInfo bg={COLORS.lightblue500} label='Holiday' />
                        </View>
                        <FlatList
                            data={employees}
                            renderItem={({ item }) => <Item id={item.id} name={item.name} avatar={item.avatar} status={item.status} />}
                            keyExtractor={item => item.id}
                        />
                    </ScrollView>
                </>
            ) : <Text>No registered data yet for the event {eventDate}</Text>}
            <BottomSheet isVisible={isVisible}>
                {bottomSheetList.map((l, i) => (
                    <ListItem bottomDivider key={i} containerStyle={l.containerStyle} onPress={l.onPress} >
                        <Icon name={l.icon} size={30} color={COLORS.primary} />
                        <ListItem.Content>
                            <ListItem.Title >{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </BottomSheet>
        </View >

    )
}

export default Chart