import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase } from '../../../config'
import { format } from 'date-fns'
import { SelectList } from 'react-native-dropdown-select-list'
import tailwind from '../../constants/tailwind'

const SignUp = ({ navigation }) => {

    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [subunitSelected, setSubunitSelected] = useState('');
    const [avatar, setAvatar] = useState('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.kindpng.com%2Fpicc%2Fm%2F52-526237_avatar-profile-hd-png-download.png&f=1&nofb=1&ipt=24bd667f767c21e1dac6ead1b76d80cdee852d105be78ddc85daab385ad432d2&ipo=images')
    const units = []

    handleSignUp = (empId, email, password, name) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => { addEmployeeDetails(empId, email, name, subunitSelected, avatar) })
            .then(() => { navigation.navigate('Sign In') })
            .catch(error => {
                console.log(error)
            });
    }
    addEmployeeDetails = (empId, email, name, subunitSelected, avatar) => {
        firebase
            .firestore()
            .collection('employees')
            .doc(empId)
            .set({
                createdAt: format(new Date(), "dd MMMM yyyy - H:mm:ss"),
                email: email,
                full_name: name,
                status_id: 1,
                subunit_id: parseInt(subunitSelected),
                avatar: avatar
            })
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
    getUnits = (subunit_id, subunit_name, id) => {
        const subscriber = firebase.firestore()
            .collection('units')
            .doc(id)
            .onSnapshot(documentSnapshot => {
                units.push({ key: subunit_id, value: `${documentSnapshot.data()['name'] + ' > ' + subunit_name}` })
            });
        return () => subscriber();
    }
    useEffect(() => {
        getSubunits()
    })

    return (
        <View className={`${tailwind.container}`}>
            <View className={`${tailwind.viewWrapper}`}>
                <Text className={`${tailwind.titleText} py-5`}>Let's sign you up</Text>
                <Text className={`${tailwind.slogan}`}>Enter your information below to continue with your account</Text>
            </View>
            <View className={`${tailwind.viewWrapper}`}>
                <TextInput
                    className={`${tailwind.inputs}`}
                    onChangeText={(text) => setEmpId(text)}
                    placeholder="Employee ID"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View className={`${tailwind.viewWrapper}`}>
                <TextInput
                    className={`${tailwind.inputs}`}
                    onChangeText={(text) => setName(text)}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View className={`${tailwind.viewWrapper}`}>
                <TextInput
                    className={`${tailwind.inputs}`}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View className={`${tailwind.viewWrapper}`}>
                <SelectList
                    data={units}
                    setSelected={setSubunitSelected}
                    placeholder='Select Unit/Subunit'
                    inputStyles={{
                        color: "#666",
                        padding: 0,
                        margin: 0,
                    }}
                    boxStyles={{
                        borderRadius: 15,
                        borderColor: '#fff',
                        color: '#fff',
                        backgroundColor: '#fff'
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
                <TextInput
                    className={`${tailwind.inputs}`}
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    secureTextEntry={true}
                    autoCorrect={false}
                />
            </View>
            <View className={`${tailwind.viewWrapper}`}>
                <TextInput
                    className={`${tailwind.inputs}`}
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholder="Confirm Password"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    secureTextEntry={true}
                    autoCorrect={false}
                />
            </View>
            <View className={`${tailwind.viewWrapper}`}>
                <TouchableOpacity
                    className={`${tailwind.buttonBlue}`}
                    onPress={() => { handleSignUp(empId, email, password, name, subunitSelected) }}
                    disabled={(!email.trim() || !password.trim())}
                >
                    <Text className={`${tailwind.buttonBlueText}`}>Create account</Text>
                </TouchableOpacity>
            </View>
            <View className={`flex-row justify-center items-center`}>
                <Text className={`text-center`}>Already an account?
                </Text>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('Sign In') }}>
                    <Text className={`${tailwind.blueTextLink}`}> Sign in here</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};
export default SignUp;
