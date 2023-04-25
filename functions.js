import NetInfo from "@react-native-community/netinfo";
import { firebase } from './config'
import { format } from 'date-fns'
import { Alert } from 'react-native'


export const checkConnection = () => {
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
        .then(() => { addEmployeeDetails(empId, email, name, subunitSelected) })
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
            employee_id: empId,
            createdAt: format(new Date(), "dd MMMM yyyy - H:mm:ss"),
            email: email,
            full_name: name,
            status_id: '1',
            subunit_id: subunitSelected,
            avatar: `https://source.unsplash.com/random/150x150/?animal`,
            permission: 'Associate'
        })
}
export const fetchUnit = async (subunit_name, id) => {
    let unit = ''
    await firebase.firestore()
        .collection('units')
        .doc(id)
        .get()
        .then(querySnapshot => {
            unit = `${querySnapshot.data()['name']}  (${subunit_name})`
        });
    return unit
}

export const generatePasscode = (length) => {
    let passcode = '';
    const characters = '0123456789';
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

export const getPermission = async (currentEmail) => {
    let permission = false
    await firebase.firestore()
        .collection('employees')
        .where('email', '==', currentEmail)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                permission = documentSnapshot.data()['permission']
            });
        });
    return permission
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

export const hanldeCreateEvent = async (selectedLocation, title, date, time, absent, sick_leave, annual_leave) => {
    date = format(date, 'yyyy-MM-dd') + ' ' + time
    await firebase.firestore()
        .collection('events')
        .add({
            start: format(new Date(), "yyyy-MM-dd H:mm"),
            end: date,
            ip_address: '',
            location: selectedLocation,
            code: generatePasscode(6),
            wifi_name: 'test_wifi',
            status_id: '1',
            title: title,
            attendance: [],
            absent: absent,
            sick_leave: sick_leave,
            annual_leave: annual_leave,
        })
        .then(() => {
            Alert.alert('Event Created', 'New event has been created', [
                { text: 'Ok' },
            ]);
        })
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

export const getDates = async () => {
    let data = []
    await new firebase.firestore()
        .collection('events')
        .orderBy('end', 'desc')
        .then(querySnapshot => {
            querySnapshot.forEach(docSnapshot => {
                console.log(docSnapshot.data()['end'])
                // locations.push({ key: `${documentSnapshot.id}`, value: `${documentSnapshot.data()["name"]}` });
            });
        });
    // .onSnapshot({
    //     next: querySnapshot => {
    //         const res = querySnapshot.docs.map(docSnapshot => ({ date: docSnapshot.data()['end'] }))
    //         if (res.length > 0) {
    //             res.forEach(documentSnapshot => {
    //                 data.push(documentSnapshot['date'])
    //             })
    //         }
    //     }
    // })

    // firebase.firestore()
    //     .collection('locations')
    //     .get()
    //     .then(querySnapshot => {
    //         querySnapshot.forEach(documentSnapshot => {
    //             locations.push({ key: `${documentSnapshot.id}`, value: `${documentSnapshot.data()["name"]}` });
    //         });
    //     });
    // return data
}

export const getStatusIcon = async (status) => {
    let icon = ''
    switch (status) {
        case 'attendance':
        case '1':
            icon = 'done'
            break;
        case 'absent':
        case '0':
            icon = 'close'
            break;
        case 'annual_leave':
        case '2':
            icon = 'flight'
            break;
        case 'sick_leave':
        case '3':
            icon = 'favorite'
            break;
    }
    return icon
}
export const getStatusName = async (statusId) => {
    let name = ''
    await firebase.firestore()
        .collection('status')
        .doc(statusId)
        .get()
        .then(documentSnapshot => {
            name = documentSnapshot.data()['name']
        });
    return name
}

export const getAllStatus = async () => {
    let status = []
    await firebase.firestore()
        .collection('status')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                status.push({ key: documentSnapshot.id, value: documentSnapshot.data()['name'] })
            });
        });
    return status
}

export const updateStatus = async (id, statusId) => {
    firebase.firestore()
        .collection('employees')
        .doc(id)
        .update({
            status_id: statusId,
        })
        .then(() => {
            console.log('Status updated!');
        });
}

export const getEmployeesByStatus = async (status_id) => {
    let emp = []
    await firebase.firestore()
        .collection('employees')
        .where('status_id', '==', status_id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                emp.push(documentSnapshot.id)
            });
        });
    return emp
}