import React, { useEffect, useRef, useState } from 'react'
import { Text, View, Dimensions, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native'
import { VictoryPie } from 'victory-native'
import { Svg } from 'react-native-svg'
import { COLORS } from '../../..'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { setDate } from 'date-fns'
import { ListItem, Avatar, Chip } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'
// import { ScrollView } from 'react-native-gesture-handler'
// import { getDates } from '../../../../functions'

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
    let details = clear

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
                    documentSnapshot.data()['attendance'].forEach(id => {
                        return employeeDetails(id)
                    })
                });
            });
    }

    employeeDetails = (id) => {
        const subscriber = firebase.firestore()
            .collection('employees')
            .doc(id)
            .onSnapshot(documentSnapshot => {
                details.push({ id: id, name: `${documentSnapshot.data()['full_name']}`, avatar: `${documentSnapshot.data()['avatar']}` })
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

    const Item = ({ id, name, avatar }) => (
        <ListItem.Swipeable
            bottomDivider
            rightWidth={90}
            minSlideWidth={10}
            rightContent={(action) => (
                <TouchableOpacity
                    style={{ backgroundColor: '#62ABEF', padding: 15, height: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
                    onPress={() => {
                        console.log('Options clicked')
                    }}
                >
                    <Text>Options</Text>
                </TouchableOpacity>
            )}
        >
            <Avatar
                rounded
                source={{ uri: `${avatar}` }}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
                <ListItem.Subtitle>{id}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem.Swipeable>
    )

    const BoxInfo = ({ bg, label }) => (
        <View
            style={{
                flex: 1,
                flexWrap: 'wrap',
                marginBottom: 5,
                flexDirection: 'column',
                display: 'flex',
                width: '100%',
            }}>
            <View
                style={{
                    width: '90%',
                    padding: 8,
                    borderRadius: 4,
                    marginTop: 8,
                    backgroundColor: `${bg}`,
                }}>

            </View>
            <View
                style={{
                    alignItems: 'center',
                    text: 'center',
                    margin: 'auto',
                }}>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '400',
                        text: 'center',
                    }}>
                    {label}
                </Text>
            </View>
        </View>
    );

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
            {
                viewDetails ? (
                    <>
                        <ScrollView>
                            <VictoryPie
                                data={graphicData}
                                width={Dimensions.get('window').width}
                                style={{
                                    width: '100%',
                                    labels: { fill: "white", fontSize: 20, fontWeight: "light" }
                                }}
                                labelRadius={({ innerRadius }) => innerRadius + 60}
                                innerRadius={20}
                                colorScale={[COLORS.primary, COLORS.lightblue700, COLORS.lightblue600, COLORS.lightblue500]}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    paddingHorizontal: 10,
                                    flexDirection: 'row',
                                    alignContent: 'space-between',
                                    marginBottom: 20
                                }}>
                                <BoxInfo bg={COLORS.primary} label='Attend' />
                                <BoxInfo bg={COLORS.lightblue700} label='Absent' />
                                <BoxInfo bg={COLORS.lightblue600} label='Sick' />
                                <BoxInfo bg={COLORS.lightblue500} label='Holiday' />
                            </View>

                            <FlatList
                                data={details}
                                renderItem={({ item }) => <Item id={item.id} name={item.name} avatar={item.avatar} />}
                                keyExtractor={item => item.id}
                            />
                        </ScrollView>
                    </>
                ) : <Text>No registered data yet for the event {eventDate}</Text>
            }
        </View >
    )
}

export default Chart