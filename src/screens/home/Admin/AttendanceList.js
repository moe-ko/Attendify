import React, { useEffect } from 'react'
import { Text } from 'react-native'
import { firebase } from '../../../../config'

const AttendanceList = () => {
    useEffect(() => {


    })

    // getCurrentEmployee = () => {
    //     firebase.firestore()
    //         .collection('employees')
    //         .get()
    //         .then(querySnapshot => {
    //             console.log('Total users: ', querySnapshot.size);
    //             querySnapshot.forEach(documentSnapshot => {
    //                 console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //             });
    //         });
    // }
    // getCurrentEmployee()

    return (
        <Text>AttendanceList</Text>
    )
}

export default AttendanceList