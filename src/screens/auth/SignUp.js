import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import { format } from 'date-fns'
import { SelectList } from 'react-native-dropdown-select-list'
import { handleSignUp } from '../../../functions'
import tailwind from '../../constants/tailwind'

const SignUp = ({ navigation }) => {

    const [empId, setEmpId] = useState('');
    const [name, setName] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [subunitSelected, setSubunitSelected] = useState('');
    const units = []

    useEffect(() => {
        getSubunits()
    })

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


    return (
        <ScrollView>
            <KeyboardAvoidingView behavior={'position'}>
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
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs}`}
                            onChangeText={(text) => setName(text)}
                            placeholder="Full Name"
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs}`}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Email"
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <SelectList
                            data={units}
                            setSelected={setSubunitSelected}
                            placeholder='Select Unit/Subunit'
                            placeholderTextColor='#000'
                            inputStyles={{
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
                            autoCapitalize='none'
                            secureTextEntry={true}
                            autoCorrect={false}
                        />
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <TouchableOpacity
                            className={`${tailwind.buttonBlue}`}
                            onPress={() => { handleSignUp(navigation, empId, email, password, name, subunitSelected) }}
                            disabled={(!email.trim() || !password.trim())}
                        >
                            <Text className={`${tailwind.buttonWhiteText}`}>Create account</Text>
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
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};
export default SignUp;
