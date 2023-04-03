import { View, Text, TouchableOpacity, Alert, Image, TextInput, Modal, KeyboardAvoidingView, Linking, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import { checkIpAddress } from '../../../functions'
import tailwind from '../../constants/tailwind'
import { ListItem, Avatar, BottomSheet, Button } from '@rneui/base'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../..'
import { SelectList } from 'react-native-dropdown-select-list'

const Profile = ({ navigation }) => {
    const [status, setStatus] = useState('');
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [unit, setUnit] = useState('');
    const [subunitId, setSubunitId] = useState();
    const [subunit, setSubunit] = useState('');
    const [ipAddress, setIpAddress] = useState('')
    const [permission, setPermission] = useState('')
    const [avatar, setAvatar] = useState('')
    const [isModalPasswordVisible, setIsModalPasswordVisible,] = useState(false);
    const [isModalUnitsVisible, setIsModalUnitsVisible,] = useState(false);
    const [subunitSelected, setSubunitSelected] = useState('');
    const units = []
    useEffect(() => {
        // getSubunits()
        getCurrentEmployee()
    }, [subunitId])


    getSubunits = () => {
        firebase.firestore()
            .collection('subunits')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    getUnits(documentSnapshot.id, documentSnapshot.data()['name'], documentSnapshot.data()['unit_id'])
                });
            });
    }
    getSubunits()
    getUnits = (subunit_id, subunit_name, id) => {
        const subscriber = firebase.firestore()
            .collection('units')
            .doc(id)
            .onSnapshot(documentSnapshot => {
                units.push({ key: subunit_id, value: `${documentSnapshot.data()['name'] + ' > ' + subunit_name}` })
            });
        return () => subscriber();
    }

    checkIpAddress().then(res => setIpAddress(res))

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
                    setSubunitId(documentSnapshot.data()['subunit_id'])
                    setEmpId(documentSnapshot.id)
                    setEmail(documentSnapshot.data()['email'])
                    setName(documentSnapshot.data()['full_name'])
                    setPermission(documentSnapshot.data()['permission'])
                    setAvatar(documentSnapshot.data()['avatar'])
                    getStatusEmployee(documentSnapshot.data()['status_id'])
                });
            });
    }

    getStatusEmployee = (status_id) => {
        const status = firebase.firestore()
            .collection('status')
            .doc(status_id)
            .onSnapshot(documentSnapshot => {
                setStatus(documentSnapshot.data()['name'])
                getSubunit(subunitId)
            });
        return () => status();
    }

    const getSubunit = (subunit_id) => {
        const subunit = firebase.firestore()
            .collection('subunits')
            .doc(subunit_id)
            .onSnapshot(documentSnapshot => {
                setSubunit(documentSnapshot.data()['name'])
                getUnit(documentSnapshot.data()['unit_id'])
            });
        return () => subunit();
    }

    getUnit = (unit_id) => {
        const subunit = firebase.firestore()
            .collection('units')
            .doc(unit_id)
            .onSnapshot(documentSnapshot => {
                setUnit(documentSnapshot.data()['name'])
            });
        return () => subunit();
    }

    updateUnit = () => {
        firebase.firestore()
            .collection('employees')
            .doc(empId)
            .update({
                subunit_id: subunitSelected,
            })
            .then(() => {
                console.log('Unit updated!');
            });
        getSubunit(subunitSelected)
        setIsModalUnitsVisible(false)
    }

    const icon = (name) => {
        return {
            properties: {
                name: name,
                type: 'material',
                size: 26,
            },
            style: {
                backgroundColor: COLORS.primary,
                marginRight: 5
            }
        }
    }

    const ProfileHeader = () => {
        return (
            <>
                <View className={`${tailwind.container2}`}>
                </View>
                <View>
                    <Image className="h-32 w-32 rounded-full mx-auto my-[-80] mb-3"
                        source={{
                            uri: `${avatar}`,
                        }}
                    />
                </View>
                <View className="pb-4 justify-center items-center">
                    <Text className={`${tailwind.titleText} text-[#7E7E7E]`}>{name}</Text><Text className={`${tailwind.slogan}`}>{empId}</Text>
                </View>
            </>
        )
    }

    const ItemContent = ({ title, data, iconName }) => {
        return (
            <>
                <Avatar rounded icon={icon(iconName)['properties']} containerStyle={icon()['style']} />
                <ListItem.Content>
                    <ListItem.Title>{title}</ListItem.Title>
                </ListItem.Content>
                <Text>{data}</Text>
            </>
        )
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView>
                <View className={`${tailwind.containerWrapper2}`}>
                    <ProfileHeader />
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} >
                        <ItemContent title={'Email'} data={email} iconName={'mail-outline'} />
                    </ListItem>
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                        <ItemContent title={'Permission'} data={permission} iconName={'trending-up'} />
                    </ListItem>
                    <TouchableOpacity onPress={() => setIsModalPasswordVisible(!isModalPasswordVisible)}>
                        <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }} >
                            <ItemContent title={'Password'} data={'**********'} iconName={'lock-open'} />
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModalUnitsVisible(!isModalUnitsVisible)}>
                        <ListItem bottomDivider containerStyle={{ marginHorizontal: 10, marginBottom: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} >
                            <ItemContent title={'Unit || Subunit'} data={`${unit} || ${subunit}`} iconName={'people-outline'} />
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
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
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalUnitsVisible}
                        onRequestClose={() => {
                            setIsModalUnitsVisible(!isModalUnitsVisible);
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
                                <Text className={`${tailwind.titleText} py-5`}>Change Unit/Subunit</Text>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <SelectList
                                        data={units}
                                        setSelected={selected => setSubunitSelected(selected)}
                                        placeholder={`${unit} || ${subunit}`}
                                        placeholderTextColor='#F5F5F5'
                                        inputStyles={{
                                            margin: 0,
                                        }}
                                        boxStyles={{
                                            borderRadius: 15,
                                            borderColor: '#fff',
                                            color: '#fff',
                                            backgroundColor: '#F5F5F5'
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
                                </View>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <TouchableOpacity
                                        className={`${tailwind.buttonBlue}`}
                                        onPress={() => updateUnit()}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className={`${tailwind.viewWrapper} `}>
                                    <TouchableOpacity
                                        className={`${tailwind.buttonWhite}`}
                                        onPress={() => setIsModalUnitsVisible(!isModalUnitsVisible)}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <View className={`${tailwind.viewWrapper} px-4`}>
                        <TouchableOpacity className={`${tailwind.buttonBlue} bg-black mb-4`} onPress={() => Linking.openURL(`http://seevee.uksouth.cloudapp.azure.com`)}>
                            <Text className={`${tailwind.buttonWhiteText}`}>SeeVee</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className={`${tailwind.buttonBlue}`} onPress={() => { handleSignOut() }}>
                            <Text className={`${tailwind.buttonWhiteText}`}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Profile