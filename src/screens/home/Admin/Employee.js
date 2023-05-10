import { ListItem, Avatar } from '@rneui/base'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Image, Modal, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { COLORS } from '../../..'
import { firebase } from '../../../../config'
import tailwind from '../../../constants/tailwind'
import { SelectList } from 'react-native-dropdown-select-list'
import { getStatusIcon, getStatusName, getAllStatus, updateStatus, getPermission, fetchUnit } from '../../../../functions'

const Employee = ({ navigation, route }) => {
    const [permission, setPermission] = useState(route.params['permission'])
    const [currentUserPermission, setCurrentUserPermission] = useState()
    const [unit, setUnit] = useState('')
    const [subunitSelected, setSubunitSelected] = useState('');
    const [isModalUnitsVisible, setIsModalUnitsVisible] = useState(false);
    const [isModalPermissionVisible, setIsModalPermissionVisible] = useState(false);
    const [isModalStatusVisible, setIsModalStatusVisible] = useState(false);
    const [statusName, setStatusName] = useState('')
    const [statusIcon, setStatusIcon] = useState('')
    const [statusId, setStatusId] = useState(route.params['status_id'])
    const [allStatus, setAllStatus] = useState()
    const units = []

    const permissions =
        currentUserPermission == 'Super Admin' ?
            [
                { key: 'Super Admin', value: 'Super Admin' },
                { key: 'Admin', value: 'Admin' },
                { key: 'Associate', value: 'Associate' }
            ] : [
                { key: 'Admin', value: 'Admin' },
                { key: 'Associate', value: 'Associate' }
            ]

    useEffect(() => {
        getUnit(route.params['subunit_id'])
        getAllStatus().then(res => setAllStatus(res))
        getPermission(firebase.auth().currentUser?.email).then(res => setCurrentUserPermission(res))
    }, [route.params['subunit_id']])

    getStatusIcon(statusId).then(res => setStatusIcon(res))
    getStatusName(statusId).then(res => setStatusName(res))

    const getUnit = (id) => {
        firebase.firestore()
            .collection('subunits')
            .doc(id)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    fetchUnit(documentSnapshot.data()['name'], documentSnapshot.data()['unit_id'])
                        .then((res) => setUnit(res))
                }
            });
    }

    const getUnits = () => {
        firebase.firestore()
            .collection('subunits')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    fetchUnit(documentSnapshot.data()['name'], documentSnapshot.data()['unit_id'])
                        .then((res) => units.push({ key: documentSnapshot.id, value: res, disabled: res == unit ? true : false }))
                });
            });
    }

    getUnits()

    updateUnit = () => {
        firebase.firestore()
            .collection('employees')
            .doc(route.params['employee_id'])
            .update({
                subunit_id: subunitSelected,
            })
            .then(() => {
                console.log('Unit updated!');
            });
        getUnit(subunitSelected)
        setIsModalUnitsVisible(false)
    }

    updatePermission = () => {
        firebase.firestore()
            .collection('employees')
            .doc(route.params['employee_id'])
            .update({
                permission: permission,
            })
            .then(() => {
                console.log('User updated!');
            });
        setIsModalPermissionVisible(false)
    }

    const ProfileHeader = () => {
        return (
            <>
                <View className={`${tailwind.container2}  align-items-center mb-0`}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                        zIndex: 3,
                        alignItems: 'center'
                    }}
                >
                    <View
                        className="rounded-full"
                        style={{
                            backgroundColor: COLORS.white,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            zIndex: 3,
                        }}>
                        <Image className="h-32 w-32 rounded-full mx-auto drop-shadow-md"

                            source={{
                                uri: `${route.params['avatar']}`,
                            }}

                        />
                    </View>

                </View>
            </>
        )
    }

    const ItemContent = ({ title, data, iconName }) => {
        return (
            <>
                <Avatar size={30} rounded icon={icon(iconName)['properties']} color={'white'} containerStyle={icon()['style']} />
                <ListItem.Content>
                    <ListItem.Title className={`${tailwind.slogan}`}>{title}</ListItem.Title>
                </ListItem.Content>
                <Text className={`${tailwind.slogan}`}>{data}</Text>
            </>
        )
    }

    const icon = (name) => {
        return {
            properties: {
                name: name,
                type: 'material',
                size: 20,
            },
            style: {
                backgroundColor: COLORS.primary,
                marginRight: 5
            }
        }
    }

    return (
        <>
            <ProfileHeader />
            {/* <ScrollView> */}
            <KeyboardAvoidingView>
                <View className={`${tailwind.containerWrapper2} bg-[${COLORS.lightblue700}]  min-h-screen mt-16`}>
                    <View className="pb-4 justify-center items-center">
                        <Text className={`${tailwind.titleText} text-[${COLORS.grey}]`}>{route.params['full_name']}</Text>
                        <Text className={`${tailwind.slogan}`}>{route.params['employee_id']}</Text>
                    </View>
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <ItemContent title={'Email'} data={route.params['email']} iconName={'email'} />
                    </ListItem>
                    {currentUserPermission == 'Admin' || currentUserPermission == 'Super Admin' ? (
                        <>
                            {currentUserPermission == 'Admin' && permission == 'Super Admin' ? (
                                <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                                    <ItemContent title={'Permission'} data={permission} iconName={'trending-up'} />
                                </ListItem>
                            ) : (
                                <TouchableOpacity onPress={() => { setIsModalPermissionVisible(true) }}>
                                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                                        <ItemContent title={'Permission'} data={permission} iconName={'trending-up'} />
                                        <ListItem.Chevron />
                                    </ListItem>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => { setIsModalStatusVisible(true) }}>
                                <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                                    <ItemContent title={'Status'} data={statusName} iconName={statusIcon} />
                                    <ListItem.Chevron />
                                </ListItem>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsModalUnitsVisible(!isModalUnitsVisible)}>
                                <ListItem containerStyle={{ marginHorizontal: 10, marginBottom: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                    <ItemContent title={'Unit'} data={`${unit}`} iconName={'people'} />
                                    <ListItem.Chevron />
                                </ListItem>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                                <ItemContent title={'Permission'} data={permission} iconName={'trending-up'} />
                            </ListItem>
                            <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                                <ItemContent title={'Status'} data={statusName} iconName={statusIcon} />
                            </ListItem>
                            <ListItem containerStyle={{ marginHorizontal: 10, marginBottom: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                <ItemContent title={'Unit/Subunit'} data={`${unit}`} iconName={'people-outline'} />
                            </ListItem>
                        </>
                    )}
                    {/* Modal Units */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalUnitsVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
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
                                        placeholder={`${unit}`}
                                        placeholderTextColor={COLORS.whiteSmoke}
                                        inputStyles={{
                                            margin: 0,
                                        }}
                                        boxStyles={{
                                            borderRadius: 15,
                                            borderColor: COLORS.white,
                                            color: COLORS.white,
                                            backgroundColor: COLORS.whiteSmoke
                                        }}
                                        dropdownStyles={{
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            borderColor: COLORS.lightGrey,
                                            backgroundColor: COLORS.lightGrey,
                                            color: COLORS.white,
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
                    {/* Modal Permission */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalPermissionVisible}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setIsModalPermissionVisible(!isModalPermissionVisible);
                        }}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}>
                            <View
                                style={{
                                    width: '80%',
                                    margin: 20,
                                    backgroundColor: COLORS.white,
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
                                <Text className={`${tailwind.titleText} py-5`}>Change Permission</Text>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <SelectList
                                        data={permissions}
                                        setSelected={selected => setPermission(selected)}
                                        placeholder={permission}
                                        placeholderTextColor={COLORS.whiteSmoke}
                                        inputStyles={{
                                            margin: 0,
                                        }}
                                        boxStyles={{
                                            borderRadius: 15,
                                            borderColor: COLORS.white,
                                            color: COLORS.white,
                                            backgroundColor: COLORS.whiteSmoke
                                        }}
                                        dropdownStyles={{
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            borderColor: COLORS.lightGrey,
                                            backgroundColor: COLORS.lightGrey,
                                            color: COLORS.white,
                                            marginLeft: 5,
                                            marginRight: 5,
                                            marginBottom: 5,
                                            marginTop: 0,
                                            position: 'relative'
                                        }}
                                    />
                                </View>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <TouchableOpacity className={`${tailwind.buttonBlue}`} onPress={() => updatePermission()}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className={`${tailwind.viewWrapper} `}>
                                    <TouchableOpacity className={`${tailwind.buttonWhite}`} onPress={() => setIsModalPermissionVisible(!isModalPermissionVisible)}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/* Modal Status */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalStatusVisible}
                        onRequestClose={() => { Alert.alert('Modal has been closed.'); setIsModalStatusVisible(!isModalStatusVisible); }}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }}>
                            <View
                                style={{
                                    width: '80%',
                                    margin: 20,
                                    backgroundColor: COLORS.white,
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
                                <Text className={`${tailwind.titleText} py-5`}>Change Status</Text>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <SelectList
                                        data={allStatus}
                                        setSelected={selected => setStatusId(selected)}
                                        placeholder={statusName}
                                        placeholderTextColor={COLORS.whiteSmoke}
                                        inputStyles={{
                                            margin: 0,
                                        }}
                                        boxStyles={{
                                            borderRadius: 15,
                                            borderColor: COLORS.white,
                                            color: COLORS.white,
                                            backgroundColor: COLORS.whiteSmoke
                                        }}
                                        dropdownStyles={{
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            borderColor: COLORS.lightGrey,
                                            backgroundColor: COLORS.lightGrey,
                                            color: COLORS.white,
                                            marginLeft: 5,
                                            marginRight: 5,
                                            marginBottom: 5,
                                            marginTop: 0,
                                            position: 'relative'
                                        }}
                                    />
                                </View>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <TouchableOpacity className={`${tailwind.buttonBlue}`}
                                        onPress={() => updateStatus(route.params['employee_id'], statusId).then(setIsModalStatusVisible(!isModalStatusVisible))}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className={`${tailwind.viewWrapper} `}>
                                    <TouchableOpacity className={`${tailwind.buttonWhite}`} onPress={() => setIsModalStatusVisible(!isModalStatusVisible)}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {permission == 'Admin' || permission == 'Super Admin' ? null : (
                        <>
                            <View className={`${tailwind.viewWrapper} px-4`}>
                                <TouchableOpacity className={`${tailwind.buttonBlue} bg-black mb-4`} onPress={() => Linking.openURL(`http://seevee.uksouth.cloudapp.azure.com`)}>
                                    <Text className={`${tailwind.buttonWhiteText}`}>SeeVee</Text>
                                </TouchableOpacity>
                            </View>
                            <View className={`${tailwind.viewWrapper} px-4`}>
                                <Text className={`${tailwind.titleText} text-[${COLORS.grey}]`}>Bench Projects</Text>
                                <Text className={`${tailwind.slogan} text-[${COLORS.grey}]`}>Coming soon</Text>
                            </View>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
            {/* </ScrollView> */}
        </>

    )
}

export default Employee