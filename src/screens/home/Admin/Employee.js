
import { ListItem, Avatar, BottomSheet } from '@rneui/base'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, TouchableOpacity, KeyboardAvoidingView, Image, Modal, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../..'
import { firebase } from '../../../../config'
import tailwind from '../../../constants/tailwind'
import { SelectList } from 'react-native-dropdown-select-list'
const Employee = ({ route }) => {
    const [subunitId, setSubunitId] = useState(route.params['subunit_id'])
    const [permission, setPermission] = useState(route.params['permission'])
    const [unit, setUnit] = useState('')
    const [subunit, setSubunit] = useState('')
    const [isPermissionVisible, setIsPermissionVisible] = useState(false);
    const [subunitSelected, setSubunitSelected] = useState('');
    const [isModalUnitsVisible, setIsModalUnitsVisible] = useState(false);
    const [isModalPermissionVisible, setIsModalPermissionVisible] = useState(false);
    const units = []
    const permissions = [
        { key: 'Super Admin', value: 'Super Admin' },
        { key: 'Admin', value: 'Admin' },
        { key: 'Associate', value: 'Associate' }
    ]
    useEffect(() => {
        getSubunit(subunitId)
    }, [subunitId])

    const getSubunit = (id) => {
        firebase.firestore()
            .collection('subunits')
            .doc(id)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setSubunit(documentSnapshot.data()['name']);
                    getUnit(documentSnapshot.data()['unit_id'])
                }
            });
    }
    const getUnit = (id) => {
        console.log('here')
        firebase.firestore()
            .collection('units')
            .doc(id)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setUnit(documentSnapshot.data()['name']);
                }
            });
    }

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
        getSubunit(subunitSelected)
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
        // setPermission(newPermission)
    }

    const ProfileHeader = () => {
        return (
            <>
                <View className={`${tailwind.container2}`}>
                </View>
                <View>
                    <Image className="h-32 w-32 rounded-full mx-auto my-[-80] mb-3"
                        source={{
                            uri: `${route.params['avatar']}`,
                        }}
                    />
                </View>
                <View className="pb-4 justify-center items-center">
                    <Text className={`${tailwind.titleText} text-[#7E7E7E]`}>{route.params['full_name']}</Text>
                    <Text className={`${tailwind.slogan}`}>{route.params['employee_id']}</Text>
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

    return (
        <ScrollView>
            <KeyboardAvoidingView>
                <View className={`${tailwind.containerWrapper2}`}>
                    <ProfileHeader />
                    <TouchableOpacity onPress={() => { setIsModalPermissionVisible(true) }}>
                        <ListItem bottomDivider containerStyle={{ marginHorizontal: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <ItemContent title={'Permission'} data={permission} iconName={'trending-up'} />
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                        <ItemContent title={'Email'} data={route.params['email']} iconName={'mail-outline'} />
                    </ListItem>
                    <TouchableOpacity onPress={() => setIsModalUnitsVisible(!isModalUnitsVisible)}>
                        <ListItem bottomDivider containerStyle={{ marginHorizontal: 10, marginBottom: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                            <ItemContent title={'Unit/Subunit'} data={`${unit} / ${subunit}`} iconName={'people-outline'} />
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
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
                                        placeholder='Select Unit/Subunit'
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
                                <Text className={`${tailwind.titleText} py-5`}>Change Permission</Text>
                                <View className={`${tailwind.viewWrapper}`}>
                                    <SelectList
                                        data={permissions}
                                        setSelected={selected => setPermission(selected)}
                                        placeholder='Select Unit/Subunit'
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
                                        onPress={() => updatePermission()}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className={`${tailwind.viewWrapper} `}>
                                    <TouchableOpacity
                                        className={`${tailwind.buttonWhite}`}
                                        onPress={() => setIsModalPermissionVisible(!isModalPermissionVisible)}>
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
                    </View>
                    <View className={`${tailwind.viewWrapper} px-4`}>
                        <Text className={`${tailwind.titleText} text-[#7E7E7E]`}>Bench Projects</Text>
                        <Text className={`${tailwind.slogan} text-[#7E7E7E]`}>Coming soon</Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Employee