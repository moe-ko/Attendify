import { View, Text, TouchableOpacity, Alert, Image, TextInput, Modal, KeyboardAvoidingView, Linking, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase, storage } from '../../../config'
import { checkIpAddress, fetchUnit, getStatusIcon, getStatusName } from '../../../functions'
import tailwind from '../../constants/tailwind'
import { ListItem, Avatar, BottomSheet, Button } from '@rneui/base'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS, ROUTES } from '../..'
import { SelectList } from 'react-native-dropdown-select-list'
import { constants } from 'buffer'
import * as ImagePicker from 'expo-image-picker'
import Entypo from 'react-native-vector-icons/Entypo'
import { getStorage, getDownloadURL, uploadBytes, ref, deleteObject } from 'firebase/storage'
//import { Appearance, useColorScheme } from 'react-native-appearance';
//import { StatusBar } from 'react-native';



const Profile = ({ navigation }) => {
    const [status, setStatus] = useState('');
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [newName, setNewName] = useState('');
    const [email, setEmail] = useState('');
    const [unit, setUnit] = useState('');
    const [subunitId, setSubunitId] = useState();
    const [subunit, setSubunit] = useState('');
    const [ipAddress, setIpAddress] = useState('')
    const [permission, setPermission] = useState('')
    const [avatar, setAvatar] = useState('')
    const [newAvatar, setNewAvatar] = useState('')
    const [isModalPasswordVisible, setIsModalPasswordVisible,] = useState(false);
    const [isModalUnitsVisible, setIsModalUnitsVisible,] = useState(false);
    const [isModalProfileVisible, setIsModalProfileVisible,] = useState(false);
    const [subunitSelected, setSubunitSelected] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(true);
    //const [theme, setTheme] = useState(lightTheme);
    const [darkMode, setDarkMode] = useState(false);
    const [statusIcon, setStatusIcon] = useState('')
    const [statusId, setStatusId] = useState('')
    const units = []
    useEffect(() => {
        getCurrentEmployee()
    }, [subunitId])


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

    checkIpAddress().then(res => setIpAddress(res))
    getStatusIcon(statusId).then(res => setStatusIcon(res))

    const handleSignOut = () => {
        firebase.auth()
            .signOut()
            .then(() => {
                navigation.replace(ROUTES.WELCOME)
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
                    setLoadingAvatar(false)
                    setStatusId(documentSnapshot.data()['status_id'])
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
                getUnit(subunitId)
            });
        return () => status();
    }

    const getUnit = (subunit_id) => {
        const subunit = firebase.firestore()
            .collection('subunits')
            .doc(subunit_id)
            .onSnapshot(documentSnapshot => {
                fetchUnit(documentSnapshot.data()['name'], documentSnapshot.data()['unit_id'])
                    .then((res) => setUnit(res))
            });
        return () => subunit();
    }

    updateUnit = (newUnit) => {
        firebase.firestore()
            .collection('employees')
            .doc(empId)
            .update({
                subunit_id: newUnit,
            })
        getUnit(newUnit)
        setIsModalUnitsVisible(false)
    }

    const changePassword = () => {
        firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email)
            .then(() => {
                Alert.alert('Reset password email sent', `Please check your email/spams`, [
                    { text: 'Ok' },
                ]);
            }).catch(e => {
                console.log(e)
            })
        setEmailSent(!emailSent)
    }

    const icon = (name) => {
        return {
            properties: {
                name: name,
                type: 'material',
                size: 20
            },
            style: {
                backgroundColor: COLORS.primary,
                marginRight: 5
            }
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
        })

        if (!result.canceled) {
            const uploadURL = await uploadImageAsync(result.assets[0].uri);
            setNewAvatar(uploadURL)
        }
    }

    const updateProfile = () => {
        firebase.firestore()
            .collection('employees')
            .doc(empId)
            .update({
                full_name: newName != name ? newName : name,
                avatar: newAvatar != avatar ? newAvatar : avatar,
            })
            .then(() => {
                getCurrentEmployee()
                setIsModalProfileVisible(!isModalProfileVisible)
            });
    }

    const uploadImageAsync = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imgRef = ref(storage, `${empId}/profile-picture`);

        try {
            deleteObject(imgRef)
        } catch (error) {
            console.log(error);
        } finally {
            await uploadBytes(imgRef, blob);
            blob.close();
            return await getDownloadURL(imgRef);
        }
    };

    const ProfileHeader = () => {
        return (
            <>
                <View className={`${tailwind.container2} align-items-center mb-0`}
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
                    <TouchableOpacity onPress={() => setIsModalProfileVisible(!isModalProfileVisible)}>
                        {loadingAvatar ? <>
                            <Avatar
                                className=""
                                size={130}
                                rounded
                                source={{ uri: avatar }}
                                containerStyle={{
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
                                }}
                            >
                                <View style={{
                                    position: 'absolute',
                                    top: 90,
                                    left: 90,
                                    backgroundColor: COLORS.primary,
                                    color: COLORS.white,
                                    borderRadius: 100,
                                    shadowColor: '#000',
                                    shadowOffset: { width: -2, height: 0 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 2,
                                    elevation: 10,
                                }} >
                                    <Avatar size={40} rounded icon={{ name: 'camera-alt', type: "material" }} color={COLORS.white} />
                                </View>
                            </Avatar>
                        </> : <>
                            <Avatar
                                className=""
                                size={130}
                                rounded
                                source={{ uri: avatar }}
                                containerStyle={{
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
                                }}
                            >
                                <View style={{
                                    position: 'absolute',
                                    top: 90,
                                    left: 90,
                                    backgroundColor: COLORS.primary,
                                    color: COLORS.white,
                                    borderRadius: 100,
                                    shadowColor: '#000',
                                    shadowOffset: { width: -2, height: 0 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 2,
                                    elevation: 10,
                                }} >
                                    <Avatar size={40} rounded icon={{ name: 'camera-alt', type: "material" }} color={COLORS.white} />
                                </View>
                            </Avatar>
                        </>}
                    </TouchableOpacity>
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

    return (
        <>
            <ProfileHeader />
            {/* <ScrollView> */}
            <KeyboardAvoidingView>
                <View className={`${tailwind.containerWrapper2} bg-[${COLORS.lightblue700}]  min-h-screen mt-16`}>
                    <View className="pb-4 justify-center items-center">
                        <TouchableOpacity onPress={() => setIsModalProfileVisible(!isModalProfileVisible)}>
                            <Text className={`${tailwind.titleText} text-[${COLORS.grey}] text-center mt-2`}>{name}</Text>
                        </TouchableOpacity>
                        <Text className={`${tailwind.slogan}`}>{empId}</Text>
                    </View>
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} >
                        <ItemContent title={'Email'} data={email} iconName={'email'} />
                    </ListItem>
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                        <ItemContent title={'Permission'} data={permission} iconName={'trending-up'} />
                    </ListItem>
                    <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                        <ItemContent title={'Status'} data={status} iconName={statusIcon} />
                    </ListItem>
                    {/* <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }}>
                        <ItemContent title={'Dark Mode'} data={'Off'} iconName={'visibility'} /> */}
                    {/* <ListItem.Chevron /> */}
                    {/* </ListItem> */}
                    <TouchableOpacity onPress={() => { setIsModalPasswordVisible(!isModalPasswordVisible) }}>
                        <ListItem bottomDivider containerStyle={{ marginHorizontal: 10 }} >
                            <ItemContent title={'Password'} data={'**********'} iconName={'lock'} />
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModalUnitsVisible(!isModalUnitsVisible)}>
                        <ListItem containerStyle={{ marginHorizontal: 10, marginBottom: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} >
                            <ItemContent title={'Unit'} data={`${unit}`} iconName={'group'} />
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    {/* CHANGE PASSWORD MODAL */}
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
                                <Text className={`${tailwind.titleText} pt-5`}>Change password</Text>
                                {emailSent ? (
                                    <>
                                        <Avatar
                                            icon={{
                                                name: 'done',
                                                type: 'material',
                                                size: 40,
                                                color: COLORS.primary
                                            }}
                                        />
                                        <Text className={`${tailwind.slogan} pb-5`}>Email sent</Text>
                                        <View className={`${tailwind.viewWrapper}`}>
                                            <TouchableOpacity
                                                className={`${tailwind.buttonBlue}`}
                                                onPress={() => { setEmailSent(!emailSent), setIsModalPasswordVisible(!isModalPasswordVisible) }}>
                                                <Text className={`${tailwind.buttonWhiteText}`}>Ok</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <Text className={`${tailwind.slogan} py-5`}>An email will be sent to {email}</Text>
                                        <View className={`${tailwind.viewWrapper}`}>
                                            <TouchableOpacity
                                                className={`${tailwind.buttonBlue}`}
                                                onPress={() => changePassword()}>
                                                <Text className={`${tailwind.buttonWhiteText}`}>Change password</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View className={`${tailwind.viewWrapper} `}>
                                            <TouchableOpacity
                                                className={`${tailwind.buttonWhite}`}
                                                onPress={() => setIsModalPasswordVisible(!isModalPasswordVisible)}>
                                                <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}

                            </View>
                        </View>
                    </Modal>
                    {/* MODAL UNITS */}
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
                                        placeholder={`${unit}`}
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
                                    <TouchableOpacity className={`${tailwind.buttonBlue}`} onPress={() => updateUnit(subunitSelected)}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className={`${tailwind.viewWrapper} `}>
                                    <TouchableOpacity className={`${tailwind.buttonWhite}`} onPress={() => setIsModalUnitsVisible(!isModalUnitsVisible)}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {/* MODAL PROFILE */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalProfileVisible}
                        onRequestClose={() => { setIsModalProfileVisible(!isModalProfileVisible) }}
                    >
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
                                <Text className={`${tailwind.titleText} py-5`}>Edit profile</Text>
                                <Avatar
                                    onPress={pickImage}
                                    className=""
                                    size={200}
                                    source={{ uri: newAvatar == '' ? avatar : newAvatar }}
                                    containerStyle={{
                                        backgroundColor: 'white'
                                    }}
                                >
                                    {/* <Avatar.Accessory  size={30} className=" mx-auto  mr-3 mb-3 justify-center items-center bg-[#62ABEF]" /> */}
                                    <View style={{
                                        position: 'absolute',
                                        top: 150,
                                        left: 150,
                                        backgroundColor: COLORS.primary,
                                        color: 'white',
                                        borderRadius: 100,
                                        shadowColor: '#000',
                                        shadowOffset: { width: -2, height: 0 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 2,
                                        elevation: 10,
                                    }} >
                                        <Avatar onPress={pickImage} size={40} rounded icon={{ name: 'camera-alt', type: "material" }} color={'white'} />
                                    </View>
                                </Avatar>
                                <TextInput
                                    className={`${tailwind.inputs} w-full my-3 bg-[#DDDDDD]`}
                                    placeholder={`Edit name: ${name}`}
                                    placeholderTextColor='#726F6F'
                                    autoCorrect={false}
                                    onChangeText={(text) => setNewName(text)}
                                />
                                <View className={`${tailwind.viewWrapper}`}>
                                    <TouchableOpacity className={`${tailwind.buttonBlue}`} onPress={() => updateProfile()}>
                                        <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className={`${tailwind.viewWrapper} `}>
                                    <TouchableOpacity className={`${tailwind.buttonWhite}`}
                                        onPress={() => { setNewAvatar(''), setIsModalProfileVisible(!isModalProfileVisible) }}>
                                        <Text className={`${tailwind.buttonBlueText}`}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View className={`${tailwind.viewWrapper} px-4`}>
                        {permission == 'Admin' || permission == 'Super Admin' ? null : (<TouchableOpacity className={`${tailwind.buttonBlue} bg-black mb-2`} onPress={() => Linking.openURL(`http://seevee.uksouth.cloudapp.azure.com`)}>
                            <Text className={`${tailwind.buttonWhiteText}`}>SeeVee</Text>
                        </TouchableOpacity>)}
                        <TouchableOpacity className={`${tailwind.buttonBlue}`} onPress={() => { handleSignOut() }}>
                            <Text className={`${tailwind.buttonWhiteText}`}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            {/* </ScrollView> */}
        </>
    )
}

export default Profile