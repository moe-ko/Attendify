import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../../config'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import { SelectList } from 'react-native-dropdown-select-list'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const SignUp = () => {
    const navigation = useNavigation();
    const [empId, setEmpId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [subunitSelected, setSubunitSelected] = useState('');
    const units = []

    handleSignUp = (empId, email, password, name) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => { addEmployeeDetails(empId, email, name, subunitSelected) })
            .then(() => { navigation.navigate('Sign In') })
            .catch(error => {
                console.log(error)
            });
    }

    addEmployeeDetails = (empId, email, name, subunitSelected) => {
        firebase
            .firestore()
            .collection('employees')
            .doc(empId)
            .set({
                createdAt: format(new Date(), "dd MMMM yyyy - H:mm:ss"),
                email: email,
                full_name: name,
                status_id: 1,
                subunit_id: parseInt(subunitSelected)
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

    getSubunits()

    return (
        <View style={style.container}>
            <View>
                <TextInput
                    style={style.input}
                    onChangeText={(text) => setEmpId(text)}
                    placeholder="Employee ID"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View>
                <TextInput
                    style={style.input}
                    onChangeText={(text) => setName(text)}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View>
                <TextInput
                    style={style.input}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <View>
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
                        borderWidth: 1,
                        borderRadius: 4,
                        borderColor: '#000',
                        color: '#fff',
                        margin: 5,
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
            <View>
                <TextInput
                    style={style.input}
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    secureTextEntry={true}
                    autoCorrect={false}
                />
            </View>
            <View>
                <TextInput
                    style={style.input}
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholder="Confirm Password"
                    placeholderTextColor="#666"
                    autoCapitalize='none'
                    secureTextEntry={true}
                    autoCorrect={false}
                />
            </View>
            <TouchableOpacity
                style={style.buttonGray}
                onPress={() => { handleSignUp(empId, email, password, name, subunitSelected) }} disabled={(!email.trim() || !password.trim())}>
                <Text>Sign Up </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonBlue}
                onPress={() => { navigation.navigate('Sign In') }}>
                <Text>Sign In </Text>
            </TouchableOpacity>
        </View>
    );
};
const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 36,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 4,
        margin: 5
    },
    buttonGray: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 4,
        margin: 5
    },
    buttonBlue: {
        alignItems: 'center',
        backgroundColor: '#62ABEF',
        padding: 10,
        borderRadius: 4,
        margin: 5
    },
})
export default SignUp
