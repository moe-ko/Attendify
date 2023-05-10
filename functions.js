import NetInfo from "@react-native-community/netinfo";
import { firebase } from './config'
import { format } from 'date-fns'
import { Alert } from 'react-native'
import { arrayUnion } from "firebase/firestore";

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
            permission: 'Associate',
            dark_mode: false
        })
}
export const fetchUnitId = async (id) => {
    let unit_id = ''
    await firebase.firestore()
        .collection('subunits')
        .doc(id)
        .get()
        .then(querySnapshot => {
            unit_id = `${querySnapshot.data()['unit_id']}`
        });
    return unit_id
}
export const fetchUnit = async (subunit_name = '', id) => {
    let unit = ''
    await firebase.firestore()
        .collection('units')
        .doc(id)
        .get()
        .then(querySnapshot => {
            unit = `${querySnapshot.data()['name']}${subunit_name != '' ? ' (' + subunit_name + ')' : ''}`
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
export const getEmployeeName = async (email) => {
    let name = ''
    await firebase.firestore()
        .collection('employees')
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                name = documentSnapshot.data()['full_name']
                // emp_data.push({ key: `${documentSnapshot.id}` });
            });
        });
    return name
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
                locations.push({ label: `${documentSnapshot.data()["name"]}`, value: `${documentSnapshot.id}` });
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

export const hanldeCreateEvent = (selectedLocation, title, sick_leave, annual_leave, createdBy, ipAddress, timerSelected) => {
    firebase.firestore()
        .collection('events')
        .add({
            start: format(new Date(), "yyyy-MM-dd H:mm"),
            end: (new Date().getTime() / 1000) + timerSelected,
            ip_address: ipAddress,
            location: selectedLocation,
            code: generatePasscode(6),
            title: title,
            attendance: [],
            absent: [],
            sick_leave: sick_leave,
            annual_leave: annual_leave,
            hasEnded: false,
            createdBy: createdBy
        })
}
export const alertCancelEvent = (id) => {
    Alert.alert('Cancel Event', 'Are you sure you want to cancel this event?', [
        {
            text: 'No',
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
                                setHasAttended(false)
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

export const getStatusIcon = async (status) => {
    let icon = ''
    switch (status) {
        case 'attendance':
        case '1':
        case 1:
            icon = 'done'
            break;
        case 'absent':
        case '0':
        case 0:
            icon = 'close'
            break;
        case 'annual_leave':
        case '2':
        case 2:
            icon = 'flight'
            break;
        case 'sick_leave':
        case '3':
        case 3:
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
}

export const getEmployeesByStatus = async (status_id) => {
    let emp = []
    await firebase.firestore()
        .collection('employees')
        .where('status_id', '==', status_id)
        .where('permission', '==', 'Associate')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                emp.push(documentSnapshot.id)
            });
        });
    return emp
}

export const getEventIpAddress = async (event_id) => {
    let res = ''
    await new firebase.firestore()
        .collection('events')
        .doc(event_id)
        .get()
        .then(documentSnapshot => {
            res = documentSnapshot.data()['ip_address']
        });
    return res
}

export const finishEvent = async (id) => {
    firebase.firestore()
        .collection('events')
        .doc(id)
        .update({
            hasEnded: true,
        })
        .then(() => {
            getAllAbsents(id)
        })
}

const getAllAbsents = async (eventId) => {
    await firebase.firestore()
        .collection('employees')
        .where('status_id', '==', '1')
        .where('permission', '==', 'Associate')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                getAttendance(eventId, documentSnapshot.id)

            });
        })
        .then(() => {
            Alert.alert('Event has finish', 'See the report in the Report screen',
                [
                    { text: 'Ok' },
                ]
            );
        })
}

const getAttendance = (eventId, empId) => {
    firebase.firestore()
        .collection('events')
        .doc(eventId)
        .get()
        .then(documentSnapshot => {
            if (documentSnapshot.data()['attendance'].includes(empId) == false) {
                addAbsents(eventId, empId)
            }
        });

}
const addAbsents = (eventId, empId) => {
    firebase.firestore()
        .collection('events')
        .doc(eventId)
        .update({
            absent: arrayUnion(empId),
        })
}


export const getCurrentEventDate = async () => {
    let dates = []
    await firebase.firestore()
        .collection('events')
        .orderBy('start', 'desc')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                dates.push({ label: `${format(new Date(documentSnapshot.data()["start"]), 'E dd MMM yy - HH:mm')}`, value: `${documentSnapshot.data()["start"]}` });
            });
        });
    return dates
}

export const getAllUnits = async () => {
    let units = []
    await firebase.firestore()
        .collection('units')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                units.push({ label: documentSnapshot.data()['name'], value: documentSnapshot.id })
            });
        });
    return units
}
export const getAllSubunitsByUnitId = async (id) => {
    let subunits = []
    await firebase.firestore()
        .collection('subunits')
        .where('unit_id', '==', id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                subunits.push({ label: documentSnapshot.data()['name'], value: documentSnapshot.id })
            });
        });
    return subunits
}
export const getCurrentEmployeeStatus = async (email) => {
    let status_id = ''
    await firebase.firestore()
        .collection('employees')
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                status_id = documentSnapshot.data()['status_id']
            });
        });
    return status_id
}