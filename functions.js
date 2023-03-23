import NetInfo from "@react-native-community/netinfo";
import { firebase } from './config'
import { format } from 'date-fns'
import { Alert } from 'react-native'

export const checkConnection = () => {
    // alert('Checking connection')
    return NetInfo.fetch().then(state => {
        return state.isConnected
    });
}

export const checkIpAddress = () => {
    return NetInfo.fetch().then(state => {
        return state.details.ipAddress
    });
}

export const handleSignUp = (navigation, empId, email, password, name, subunitSelected, permissionId, statusId) => {
    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => { addEmployeeDetails(empId, email, name, subunitSelected, permissionId, statusId) })
        .then(() => { navigation })
        .catch(error => {
            console.log(error)
        });
}

const addEmployeeDetails = (empId, email, name, subunitSelected) => {
    firebase
        .firestore()
        .collection('employees')
        .doc(empId)
        .set({
            createdAt: format(new Date(), "dd MMMM yyyy - H:mm:ss"),
            email: email,
            full_name: name,
            status_id: '1',
            subunit_id: subunitSelected,
            avatar: `https://source.unsplash.com/random/150x150/?animal`,
            permission_id: '0'
        })
}
// export const getSubunits = async () => {
//     // let d = []
//     firebase.firestore()
//         .collection('subunits')
//         .get()
//         .then(querySnapshot => {
//             querySnapshot.forEach(documentSnapshot => {
//                 console.log(documentSnapshot.data())
//                 getUnits(documentSnapshot.id, documentSnapshot.data()['name'], documentSnapshot.data()['unit_id'])
//             });
//         });
// }
// const getUnits = (subunit_id, subunit_name, id) => {
//     const units = []
//     const subscriber = firebase.firestore()
//         .collection('units')
//         .doc(id)
//         .onSnapshot(documentSnapshot => {
//             units.push({ key: subunit_id, value: `${documentSnapshot.data()['name'] + ' > ' + subunit_name}` })
//         });
//     console.log(units)
//     return () => subscriber();
// }


export const generatePasscode = (length) => {
    let passcode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        passcode += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return passcode;
}

export const getEmployeeId = async () => {
    let id = ''
    await firebase.firestore()
        .collection('employees')
        .where('email', '==', firebase.auth().currentUser?.email)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                id = documentSnapshot.id
                // emp_data.push({ key: `${documentSnapshot.id}` });
            });
        });
    return id
}

export const isAdmin = async (id) => {
    let isAdmin = false
    await firebase.firestore()
        .collection('employees')
        .doc('111111')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                if (documentSnapshot.data()['permission_id'] == 1) {
                    isAdmin = true
                }
            });
        });
    return isAdmin
}

export const getLocations = async () => {
    let locations = []
    await firebase.firestore()
        .collection('locations')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                locations.push({ key: `${documentSnapshot.id}`, value: `${documentSnapshot.data()["name"]}` });
            });
        });
    return locations
}

export const getLocationName = async (id) => {
    let location = ''
    await firebase.firestore()
        .collection('locations')
        .doc(id)
        .get()
        .then(documentSnapshot => {
            location = documentSnapshot.data()['name']
        });
    return location
}

export const hanldeCreateEvent = async (selectedLocation, title, endDate) => {
    await firebase.firestore()
        .collection('events')
        .add({
            start: format(new Date(), "yyyy-MM-dd H:mm"),
            end: format(endDate, "yyyy-MM-dd H:mm"),
            ip_address: '',
            location: selectedLocation,
            code: generatePasscode(6),
            wifi_name: 'test_wifi',
            status_id: '1',
            title: title,
            attendance: []
        })
        .then(() => {
            Alert.alert('Event Created', 'New event has been created', [
                { text: 'Ok' },
            ]);
        })
    // setCreateEventVisible(!createEventVisible)
    // getCurrentEvent()
    // setCurrentEventVisible(!currentEventVisible)
}
export const alertCancelEvent = (id) => {
    Alert.alert('Cancel Event', 'Are you sure you want to cancel this event?', [
        {
            text: 'No',
            onPress: () => console.log('No'),
            style: 'cancel',
        },
        { text: 'Yes', onPress: () => cancelEvent(id) },
    ]);
}

export const cancelEvent = async (id) => {
    let deleted = false
    await firebase.firestore()
        .collection('events')
        .doc(id)
        .delete()
        .then(() => {
            //Event needs to be deleted from attendance table
            firebase.firestore()
                .collection('attendance')
                .where('event_id', '==', id)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(documentSnapshot => {
                        firebase.firestore()
                            .collection('attendance')
                            .doc(documentSnapshot.id)
                            .delete()
                            .then(() => {
                                console.log(`Event ${id} deleted from attendance!`);
                                setHasAttended(false)
                                // clearInterval(eventTimer)
                            });
                    });
                });
        })
        .then(() => {
            Alert.alert('Event Cancelled', 'This is event has been cancelled', [
                { text: 'Ok' },
            ]);
        })
        .then(() => {
            deleted = true
        })
    return deleted
}