import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions, FlatList, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native'
import { VictoryPie } from 'victory-native'
import { Svg } from 'react-native-svg'
import { COLORS, ROUTES } from '../../..'
import { firebase } from '../../../../config'
import { SelectList } from 'react-native-dropdown-select-list'
import Icon from 'react-native-vector-icons/Ionicons'
import tailwind from '../../../constants/tailwind'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'
import * as Print from 'expo-print';
import BoxInfo from '../../../components/BoxInfo'
import EmployeeItem from '../../../components/EmployeeItem'

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
            .orderBy('start', 'desc')
            .onSnapshot({
                next: querySnapshot => {
                    const res = querySnapshot.docs.map(docSnapshot => ({ key: docSnapshot.data()['start'], value: docSnapshot.data()['start'] }))
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
            .where('start', '==', eventDate)
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
                employees.push({
                    id: id,
                    email: `${documentSnapshot.data()['email']}`,
                    name: `${documentSnapshot.data()['full_name']}`,
                    avatar: `${documentSnapshot.data()['avatar']}`,
                    subunit: documentSnapshot.data()['subunit_id'],
                    status: status
                })
            });
        return () => subscriber();
    }


    const attendPercent = Math.round(attend / totalAssitance * 100)
    const absentPercent = Math.round(absent / totalAssitance * 100)
    const slPercent = Math.round(sickLeave / totalAssitance * 100)
    const alPercent = Math.round(annualLeave / totalAssitance * 100)

    const graphicData = [
        { x: `${attendPercent}% ✔️`, y: attendPercent },
        { x: `${absentPercent}% ❌`, y: absentPercent },
        { x: `${slPercent}% ❤`, y: slPercent },
        { x: `${alPercent}% ✈️`, y: alPercent },
    ]

    const data = [
        {
            id: 1,
            name: 'Item 1'
        },
        {
            id: 2,
            name: 'Item 2'
        },
        {
            id: 3,
            name: 'Item 3'
        }
    ];

    const generatePDF = async () => {
        const array = employees
        var table = ''
        const statusInfo = (status) => {
            switch (status) {
                case 'attendance': case '0':
                    return [COLORS.blue900, 'Attend']
                case 'absent': case '1':
                    return [COLORS.blueA700, 'Absent']
                case 'sick_leave': case '2':
                    return [COLORS.primary, 'Sick Leave']
                case 'annual_leave': case '3':
                    return [COLORS.lightblue700, 'Annual Leave']
            }
        }
        for (let i in array) {
            table = table + `
            <tr>
            <td>${array[i]['id']}</td>
            <td>${array[i]['name']}</td> 
            <td>${array[i]['email']}</td> 
            <td style="font-weight:bold; color:white; background-color:${statusInfo(array[i]['status'])[0]}">${statusInfo(array[i]['status'])[1]}</td>
            </tr>`
        }

        let gData = ''
        for (let i in graphicData) {
            if (graphicData[i]['y'] > 0) {
                gData = gData + `{
                    y: ${graphicData[i]['y']}, 
                    label: "${statusInfo(i)[1]}",
                    color:"${statusInfo(i)[0]}"
                },`
            }
        }
        const html = `
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                        h1{
                            font-size: 40px; 
                            font-family: Helvetica Neue; 
                            font-weight: bold; 
                            color: #62ABEF;
                            margin: 0;
                        }
                        h3{
                            font-size: 30px; 
                            font-family: Helvetica Neue; 
                            font-weight: light; 
                            color: #7E7E7E;
                            margin: 0;
                        }
                        h6{
                            font-size: 15px; 
                            font-family: Helvetica Neue; 
                            font-weight: light; 
                            color: black;
                            margin: 0;
                        }
                        .styled-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 25px 0;
                            font-size: 1em;
                            font-family: sans-serif;
                            min-width: 400px; 
                        }
                        th{ 
                            background-color: #62ABEF;
                            border: 1px solid #DDDDDD;
                            font-weight: bold;
                            text-align: center;
                            color: white;
                            font-size: 20px; 
                        }  
                        tbody tr{
                           font-size: 16px; 
                        }
                        tbody tr:nth-of-type(even) {
                            background-color: rgba(0, 0, 0, 0.12);
                        }
                    </style>
                    <script>
                        window.onload = function() {
                        var chart = new CanvasJS.Chart("chartContainer", {
                            animationEnabled: false,
                            data: [{
                                type: "pie",
                                startAngle: 240,
                                yValueFormatString: "##0.00\"%\"",
                                indexLabel: "{label} {y}%",
                                indexLabelPlacement: "inside", 
                                indexLabelFontColor:"white",
                                indexLabelFontWeight: "bold",
                                dataPoints: [${gData}]
                            }]
                        });
                        chart.render();
                    }
                    </script>
                </head>
                <body>
                    <div style="display: flex; flex-direction: row;">
                        <div style="width:40%; justify-content: center;">
                            <h1>Attendify</h1>
                            <h3>Event report</h3>
                            <h6>Date: ${eventDate}</h6>
                        </div>
                        <div style="width:60%">
                            <div id="chartContainer" style="height: 370px; width:100%;"></div>
                        </div> 
                    </div>
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Employee Id</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>${eventDate}</th>
                            </tr>
                        </th>
                        <tbody>${table}</tbody> 
                    </table>
                    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"> </script>
                </body>
                </html>
                `;

        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({
            html,
            margins: {
                left: 20,
                top: 50,
                right: 20,
                bottom: 100,
            },
        });

        const pdfName = `${uri.slice(
            0,
            uri.lastIndexOf('/') + 1
        )}attendify_event_${eventDate.split(" ").join("_").split(":").join("-")}.pdf`

        await FileSystem.moveAsync({
            from: uri,
            to: pdfName,
        })

        await shareAsync(pdfName)
        // console.log(uri)
        // Alert.alert('Successfuly saved'[
        //     { text: 'Cancel', style: 'cancel' },
        //     { text: 'Open', onPress: () => openFile(uri) }
        // ])
    }

    // const openFile = (filepath) => {
    //     const path = FileViewer.open(filepath) // absolute-path-to-my-local-file.
    //         .then(() => { 
    //         })
    //         .catch((error) => { 
    //         });
    // }

    return (
        <>
            {eventExist ? (
                <View>
                    <View className={`${tailwind.viewWrapper} bg-[#FFFFFF] rounded-b-3xl items-center  py-4 px-6 justify-center `} style={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <View className={`w-screen px-3 d-flex flex-row justify-between`}>
                            <View className={`w-10/12 `}>
                                <SelectList
                                    data={dates}
                                    setSelected={selectedDate => { setEventDate(selectedDate), getTotalAttendance() }}
                                    placeholder={eventDate}
                                    placeholderTextColor='#726F6F'
                                    inputStyles={{
                                        color: "#666",
                                        padding: 2,
                                        margin: 0,
                                    }}
                                    boxStyles={{
                                        borderRadius: 20,
                                        color: 'black',
                                        backgroundColor: '#F5F5F5',
                                        borderColor: 'white',
                                    }}
                                    dropdownStyles={{
                                        borderWidth: 0,
                                        borderRadius: 4,
                                        borderColor: '#DDDDDD',
                                        backgroundColor: '#DDDDDD',
                                        color: '#fff',
                                        marginLeft: 5,
                                        marginRight: 5,
                                        marginBottom: 5,
                                        marginTop: 0,
                                        position: 'relative',
                                    }}
                                />
                            </View>
                            <TouchableOpacity onPress={generatePDF} >
                                <Icon name={'cloud-download'} size={30} color={COLORS.primary} style={{ marginLeft: 10 }} />
                                <Text className={`${tailwind.slogan} text-xs text-[${COLORS.grey}]`}>Download</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {viewDetails ? (
                        <>
                            <ScrollView>
                                <Text className={`${tailwind.titleText} text-[${COLORS.grey}] ml-5`}>Graphic Report</Text>
                                <Text className={`${tailwind.slogan} text-[${COLORS.grey}] ml-5`}>{eventDate}</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between', marginBottom: 20 }}>
                                    <View style={{ width: '80%', flexDirection: 'row', alignContent: 'center', }}>
                                        <VictoryPie
                                            data={graphicData}
                                            width={300}
                                            height={300}
                                            padding={5}
                                            margin={0}
                                            style={{ labels: { fill: "white", fontSize: 20, fontWeight: "light" } }}
                                            labelRadius={({ innerRadius }) => innerRadius + 40}
                                            innerRadius={30}
                                            colorScale={[COLORS.blue900, COLORS.blueA700, COLORS.primary, COLORS.lightblue700]}
                                        />
                                    </View>
                                    <View style={{ width: '20%', display: 'flex', justifyContent: 'center' }}>
                                        <BoxInfo props={{ bg: COLORS.blue900, label: 'Attend', status: 'attendance' }} />
                                        <BoxInfo props={{ bg: COLORS.blueA700, label: 'Absent', status: 'absent' }} />
                                        <BoxInfo props={{ bg: COLORS.primary, label: 'Sick', status: 'sick_leave' }} />
                                        <BoxInfo props={{ bg: COLORS.lightblue700, label: 'Holiday', status: 'annual_leave' }} />
                                    </View>
                                </View>
                                <Text className={`${tailwind.titleText} text-[${COLORS.grey}] ml-5`}>Assistance</Text>
                                <Text className={`${tailwind.slogan} text-[${COLORS.grey}] ml-5 mb-5`}>Employees</Text>
                                <FlatList marginBottom={100}
                                    data={employees}
                                    renderItem={({ item }) => <EmployeeItem props={{ id: item.id, name: item.name, avatar: item.avatar, status: item.status, event: eventDate }} />}
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
                    {/* <BottomSheet isVisible={isVisible}>
                        {bottomSheetList.map((l, i) => (
                            <ListItem bottomDivider key={i} containerStyle={l.containerStyle} onPress={l.onPress} borderRadius='10'>
                                <Icon name={l.icon} size={30} color={COLORS.primary} />
                                <ListItem.Content>
                                    <ListItem.Title >{l.title}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </BottomSheet> */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});

export default Chart