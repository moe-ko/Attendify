import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions, FlatList, Button, TouchableOpacity } from 'react-native'
import { VictoryPie } from 'victory-native'
import { Svg } from 'react-native-svg'
import { COLORS } from '../../..'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import { setDate } from 'date-fns'
import { ListItem, Avatar } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'

const Chart = () => {
    const [eventDate, setEventDate] = useState('')
    const [attend, setAttend] = useState(100)
    const [absent, setAbsent] = useState(0)
    const [sickLeave, setSickLeave] = useState(0)
    const [annualLeave, setAnnualLeave] = useState(0)
    const [totalAssitance, setTotalAssistance] = useState(0)
    const [viewChart, setViewChart] = useState(false)
    const [clear, setClear] = useState([])
    const dates = []
    let details = clear

    useEffect(() => {
        getCurrentEventDate()
    }, [])

    const getCurrentEventDate = () => {
        firebase.firestore()
            .collection('events')
            .orderBy('end', 'desc')
            .onSnapshot({
                next: querySnapshot => {
                    const res = querySnapshot.docs.map(docSnapshot => ({ date: docSnapshot.data()['end'] }))
                    if (res.length > 0) {
                        setEventDate(res[0]['date'])
                        getTotalAttendance(res[0]['date'])
                    }
                }
            })
    }

    getDates = () => {
        firebase.firestore()
            .collection('events')
            .orderBy('end', 'desc')
            .onSnapshot({
                next: querySnapshot => {
                    const res = querySnapshot.docs.map(docSnapshot => ({ date: docSnapshot.data()['end'] }))
                    if (res.length > 0) {
                        res.forEach(documentSnapshot => {
                            dates.push(documentSnapshot['date'])
                        })
                    }

                }
            })
        // getCurrentEventDate()
    }


    if (dates.length == 0) { getDates() }

    const getTotalAttendance = (date) => {
        setEventDate(date)
        const subscriber = firebase.firestore()
            .collection('events')
            .where('end', '==', date)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {

                    setAttend(documentSnapshot.data()['attendance'].length);
                    setAbsent(documentSnapshot.data()['absent'].length);
                    setSickLeave(documentSnapshot.data()['sick_leave'].length);
                    setAnnualLeave(documentSnapshot.data()['annual_leave'].length);
                    setTotalAssistance(documentSnapshot.data()['attendance'].length + documentSnapshot.data()['absent'].length + documentSnapshot.data()['sick_leave'].length + documentSnapshot.data()['annual_leave'].length);
                    if (documentSnapshot.data()['attendance'].length > 0 || documentSnapshot.data()['absent'].length > 0 || documentSnapshot.data()['sick_leave'].length > 0 || documentSnapshot.data()['annual_leave'].length > 0) {
                        setViewChart(true)
                    } else {
                        setViewChart(false)
                    }
                    setClear([])
                    documentSnapshot.data()['attendance'].forEach(id => {
                        employeeDetails(id)
                    })
                });
            });
        return () => subscriber();
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

        ;
    return (
        <View>

            <SelectList
                data={dates}
                setSelected={setEventDate => getTotalAttendance(setEventDate)}
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
                viewChart ? (
                    <>
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
                        <FlatList
                            data={details}
                            renderItem={({ item }) => <Item id={item.id} name={item.name} avatar={item.avatar} />}
                            keyExtractor={item => item.id}
                        />
                    </>
                ) : <Text>No registered data yet for the event {eventDate}</Text>
            }
        </View >
    )
}

export default Chart