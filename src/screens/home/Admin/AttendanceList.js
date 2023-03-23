import { da } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
import { Text, View, Dimensions, FlatList } from 'react-native'
import { firebase } from '../../../../config'

const AttendanceList = ({ props }) => {
    const [date, setDate] = useState('')
    const [attendees, setAttendees] = useState([])
    const [attendeesNames, setAttendeesNames] = useState([])

    getEmployees = (id) => {
        // firebase.firestore()
        //     .collection('events')
        //     .where('end', '==', id)
        //     .onSnapshot({
        //         next: querySnapshot => {
        //             querySnapshot.docs.map(docSnapshot => (
        //                 docSnapshot.data()['attendance'].forEach(id => {
        //                     firebase.firestore()
        //                         .collection('employees')
        //                         .doc(id)
        //                         .onSnapshot(documentSnapshot => {
        //                             if (!attendees.includes(documentSnapshot.id)) {
        //                                 setAttendees([...attendees, documentSnapshot.id]);
        //                                 setAttendeesNames([...attendeesNames, documentSnapshot.data()['full_name']]);
        //                             }
        //                         });
        //                 })
        //             ))
        //         }
        //     })

    }
    // console.log(props)
    if (props != undefined) {
        console.log(props)
        // getEmployees(props);
    }
    let data = []

    // if (attendees.length > 0) {
    //     for (let i = 0; i < attendees.length; i++) {
    //         data.push({ id: attendees[i], name: attendeesNames[i] })
    //     }
    // }

    return (
        <View>
            {/* <FlatList
                data={data}
                renderItem={({ item }) => <Text>{item.id}|{item.name}</Text>}
            /> */}
        </View>
    )
}

export default AttendanceList