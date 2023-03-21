import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions } from 'react-native'
import { VictoryPie } from 'victory-native'
import { Svg } from 'react-native-svg'
import colors from '../../../constants/colors'
import { COLORS } from '../../..'
import AttendanceList from './AttendanceList'
import { firebase } from '../../../../config'



const PieChart = ({ props }) => {

    const [attend, setAttend] = useState(0)
    const [absent, setAbsent] = useState(0)
    const [sickLeave, setSickLeave] = useState(0)
    const [annualLeave, setAnnualLeave] = useState(0)
    const [totalAssitance, setTotalAssistance] = useState(0)
    const [viewChart, setViewChart] = useState(false)
    const attendPercent = Math.round(attend / totalAssitance * 100)
    const absentPercent = Math.round(absent / totalAssitance * 100)
    const slPercent = Math.round(sickLeave / totalAssitance * 100)
    const alPercent = Math.round(annualLeave / totalAssitance * 100)

    const graphicData = [
        { x: `Attend ${attend}`, y: attendPercent },
        { x: `Absent ${absent}`, y: absentPercent },
        { x: `Sick ${sickLeave}`, y: slPercent },
        { x: `On Leave ${annualLeave}`, y: alPercent }
    ]

    const getTotalAttendance = (id) => {
        const subscriber = firebase.firestore()
            .collection('events')
            .doc(id)
            .onSnapshot(documentSnapshot => {
                setAttend(documentSnapshot.data()['attendance'].length);
                setAbsent(documentSnapshot.data()['absent'].length);
                setSickLeave(documentSnapshot.data()['sick_leave'].length);
                setAnnualLeave(documentSnapshot.data()['annual_leave'].length);
                setTotalAssistance(documentSnapshot.data()['attendance'].length + documentSnapshot.data()['absent'].length + documentSnapshot.data()['sick_leave'].length + documentSnapshot.data()['annual_leave'].length);
                setViewChart(true)
            });

        // Stop listening for updates when no longer required
        return () => subscriber();
    }
    if (props.id != undefined) {
        getTotalAttendance(props.id)
    }
    return (
        <View>
            {viewChart ? (
                <VictoryPie
                    data={graphicData}
                    width={Dimensions.get('window').width}
                    style={{
                        width: '90%',
                        labels: { fontSize: 10, fill: "black" }
                    }}
                    colorScale={[COLORS.primary, COLORS.lightblue700, COLORS.lightblue600, COLORS.lightblue500]}
                />
            ) : null}
            <AttendanceList />
        </View>
    )
}

export default PieChart