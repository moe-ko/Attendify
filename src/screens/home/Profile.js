import { View, Text, TouchableOpacity, Alert, Image, TextInput, Modal, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import Geolocation from '../../../components/Geolocation'
import { checkIpAddress } from '../../../functions'
import tailwind from '../../constants/tailwind'
import { ListItem, Avatar, BottomSheet, Button } from '@rneui/base'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../..'

const Profile = ({ navigation }) => {
    const [status, setStatus] = useState('');
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [unit, setUnit] = useState('');
    const [subunit, setSubunit] = useState('');
    const [ipAddress, setIpAddress] = useState('')
    const [permission, setPermission] = useState('')
    const [avatar, setAvatar] = useState('')
    const [isModalPasswordVisible, setIsModalPasswordVisible,] = useState(false);
    checkIpAddress().then(res => {
        setIpAddress(res)
    })

    const handleSignOut = () => {
        firebase.auth()
            .signOut()
            .then(() => {
                navigation.replace('Welcome')
            })
            .catch(error => console.log(error.message))
    }

    getCurrentEmployee = () => {
        firebase.firestore()
            .collection('employees')
            .where('email', '==', firebase.auth().currentUser?.email)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    getStatusEmployee(documentSnapshot.data()['status_id'])
                    getSubunits(documentSnapshot.data()['subunit_id'])
                    setEmpId(documentSnapshot.id)
                    setEmail(documentSnapshot.data()['email'])
                    setName(documentSnapshot.data()['full_name'])
                    setPermission(documentSnapshot.data()['permission_id'])
                    setAvatar(documentSnapshot.data()['avatar'])
                });
            });
    }

    getStatusEmployee = (status_id) => {
        const status = firebase.firestore()
            .collection('status')
            .doc(status_id)
            .onSnapshot(documentSnapshot => {
                setStatus(documentSnapshot.data()['name'])
                getUnits(documentSnapshot.id)
            });
        return () => status();
    }

    getSubunits = (subunit_id) => {
        const subunit = firebase.firestore()
            .collection('subunits')
            .doc(subunit_id)
            .onSnapshot(documentSnapshot => {
                setSubunit(documentSnapshot.data()['name'])
            });
        return () => subunit();
    }

    getUnits = (unit_id) => {
        const subunit = firebase.firestore()
            .collection('units')
            .doc(unit_id)
            .onSnapshot(documentSnapshot => {
                setUnit(documentSnapshot.data()['name'])
            });
        return () => subunit();
    }

    getCurrentEmployee()

    PasswordBottomSheet = () => {
        return (
            <>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>
                            <TextInput
                                onChangeText={(text) => handleEmpId(text)}
                                placeholder="Old password"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>
                            <TextInput
                                onChangeText={(text) => handleEmpId(text)}
                                placeholder="New password"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>
                            <TextInput
                                onChangeText={(text) => handleEmpId(text)}
                                placeholder="Confirm password"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                            <Button title="Cancel" type="outline" style={{
                                marginRight: 5
                            }} onPress={() => { setIsPasswordBottomSheetVisible(false) }} />
                            <Button title="Save" />
                        </View>
                    </ListItem.Content>
                </ListItem>
            </>
        )
    }

    return (

        <View>

            <View className={`${tailwind.containerWrapper2}`}>
                <View className={`${tailwind.container2}`}>
                </View>
                <View>

                    <Image
                        className="h-32 w-32 rounded-full mx-auto my-[-80] mb-3"
                        source={{
                            uri: `${avatar}`,
                        }}

                    />
                </View>

                <View className="py-1 shadow-2xl justify-center items-center">
                    <View><Text>User: {name}</Text></View>
                    <View className="py-1"><Text>Employee Id: {empId}</Text></View>
                </View>
                {/* <View className=" bg-white m-7 rounded-2xl w-96 h-28 shadow-2xl"> */}
                <ListItem bottomDivider containerStyle={{ marginHorizontal: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    <Avatar
                        rounded
                        icon={{
                            name: 'mail-outline',
                            type: 'material',
                            size: 26,
                        }}
                        containerStyle={{ backgroundColor: COLORS.primary }}
                    />
                    <ListItem.Content>
                        <ListItem.Title>Email </ListItem.Title>
                    </ListItem.Content>
                    <Text>{email}</Text>
                </ListItem>
                <TouchableOpacity onPress={() => setIsModalPasswordVisible(!isModalPasswordVisible)}>
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }} >
                        <Avatar
                            rounded
                            icon={{
                                name: 'lock-open',
                                type: 'material',
                                size: 26,
                            }}
                            containerStyle={{ backgroundColor: COLORS.primary }}
                        />
                        <ListItem.Content>
                            <ListItem.Title>Password</ListItem.Title>
                        </ListItem.Content>
                        <Text>******</Text>
                        <ListItem.Chevron />
                    </ListItem>
                </TouchableOpacity>
                <ListItem bottomDivider
                    containerStyle={{ marginHorizontal: 10, marginBottom: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                >
                    <Avatar
                        rounded
                        icon={{
                            name: 'people-outline',
                            type: 'material',
                            size: 26,
                        }}
                        containerStyle={{ backgroundColor: COLORS.primary }}
                    />
                    <ListItem.Content>
                        <ListItem.Title>Unit/Subunit</ListItem.Title>
                    </ListItem.Content>
                    <Text>{unit}/{subunit}</Text>
                    <ListItem.Chevron />
                </ListItem>
                <KeyboardAvoidingView>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalPasswordVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setIsModalPasswordVisible(!isModalPasswordVisible);
                        }}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                            <View style={{
                                width: '80%',
                                margin: 20,
                                backgroundColor: 'white',
                                borderRadius: 20,
                                padding: 10,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}>
                                <Text className={`${tailwind.titleText} py-5`}>Change password</Text>
                                <Text className={`py-5`}>(FUNCTIONS NOT IMPLEMENTED YET)</Text>
                                <TextInput
                                    placeholderTextColor="#000"
                                    style={{
                                        marginBottom: 10,
                                        backgroundColor: '#F5F5F5',
                                        width: '100%'
                                    }}
                                    className={`${tailwind.inputs}`}
                                    // onChangeText={setConfirmPassword}
                                    placeholder="Old Password"
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    autoCorrect={false}
                                />
                                <TextInput
                                    placeholderTextColor="#000"
                                    style={{
                                        marginBottom: 10,
                                        backgroundColor: '#F5F5F5',
                                        width: '100%'
                                    }}
                                    className={`${tailwind.inputs}`}
                                    // onChangeText={setConfirmPassword}
                                    placeholder="New Password"
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    autoCorrect={false}
                                />
                                <TextInput
                                    className={`${tailwind.inputs}`}
                                    placeholderTextColor="#000"
                                    style={{
                                        marginBottom: 10,
                                        backgroundColor: '#F5F5F5',
                                        width: '100%'
                                    }}
                                    // className={`${tailwind.inputs}`}
                                    // onChangeText={setConfirmPassword}
                                    placeholder="Confirm Password"
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    autoCorrect={false}
                                />
                                <View className={`${tailwind.viewWrapper}`}>
                                    <TouchableOpacity
                                        className={`${tailwind.buttonBlue}`}
                                        onPress={() => setIsModalPasswordVisible(!isModalPasswordVisible)}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className={`${tailwind.viewWrapper} `}>
                                    <TouchableOpacity
                                        className={`${tailwind.buttonWhite}`}
                                        onPress={() => setIsModalPasswordVisible(!isModalPasswordVisible)}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
                {/* </View> */}
                {permission == '1' ? (
                    <TouchableOpacity onPress={() => { console.log('Make admin') }}>
                        <Text>Make user an admin</Text>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity className={`${tailwind.buttonBlue} bg-black w-96 mb-7`} onPress={() => { console.log('Link to SeeVee') }}>
                    <Text className={`${tailwind.buttonWhiteText}`}>SeeVee</Text>
                </TouchableOpacity>

                <TouchableOpacity className={`${tailwind.buttonBlue} w-96 mb-7`} onPress={() => { handleSignOut() }}>
                    <Text className={`${tailwind.buttonWhiteText}`}>Sign Out</Text>
                </TouchableOpacity>


            </View>
        </View >
    )
}

export default Profile