import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Component } from 'react'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import { format } from 'date-fns'
import { SelectList } from 'react-native-dropdown-select-list'
import { handleSignUp } from '../../../functions'
import tailwind from '../../constants/tailwind'


const SignUp = ({ navigation }) => {

    const [empId, setEmpId] = useState('');
    const [validempId, setValidEmpId] = useState(false);
    const [validEmpName, setValidEmpName] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [checkValidEmail, setCheckValidEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [validpassword, setValidPassword] = useState(false);
    const [validpassword1, setValidPassword1] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validconfirmPassword, setValidConfirmPassword] = useState();
    const [error, setError] = useState('');
    const [subunitSelected, setSubunitSelected] = useState('');
    const units = []


    useEffect(() => {
        getSubunits()
    })

    // const validator=(input,value)

    useEffect(() => {
        if (password === confirmPassword) {
            setValidConfirmPassword(true);
        }
        else {
            setValidConfirmPassword(false);
        }
    }, [, confirmPassword]);


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
    const handleCheckEmail = (text) => {
        let re = /\S+@\S+\.\S+/;
        let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        setEmail(text);
        if (re.test(text) || regex.test(text)) {
            setCheckValidEmail(false);
        } else {
            setCheckValidEmail(true);
        }
    };
    const handleEmpId = (text) => {

        let regex = /^[0-9]{7}$/;
        setEmpId(text);
        if (regex.test(text)) {
            setValidEmpId(false);
        } else {
            setValidEmpId(true);
        }
    };


    const checkPasswordValidity = value => {
        const isNonWhiteSpace = /^\S+$/;
        const isValidLength = /^.{8,16}$/;
        setPassword(value);

        if ((!isValidLength.test(value))) {

            setValidPassword(true);

        }
        else {
            setValidPassword(false);
        }
        if (!isNonWhiteSpace.test(value)) {
            setValidPassword1(true);
        }
        else {
            setValidPassword1(false);
        }

    };

    const handleEmpName = (text) => {

        let regex = /^[a-zA-Z]{*}\S[a-zA-Z]{*}$/;
        setName(text);

        if (regex.test(text)) {
            setValidEmpName(false);
        } else {
            setValidEmpName(true);
        }
    };

    return (
        <ScrollView>
            <KeyboardAvoidingView>
                <View className=" h-screen items-center px-4 bg-[#ECF0F3] w-full">
                    <View className={`${tailwind.viewWrapper}`}>
                        <Text className={`${tailwind.titleText} py-5`}>Let's sign you up</Text>
                        <Text className={`${tailwind.slogan}`}>Enter your information below to continue with your account</Text>
                    </View>
                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs}`}
                            onChangeText={(text) => handleEmpId(text)}
                            placeholder="Employee ID"
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>

                    {validempId && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Employee Id must be 7 digits </Text>}

                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            //keyboardType='name-phone-pad'

                            className={`${tailwind.inputs}`}
                            onChangeText={(text) => setName(text)}
                            //onChangeText={text => handleOnchange(text, 'name')}
                            //onFocus={() => handleError(null, 'name')}
                            placeholder="Full Name"
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                    </View>
                    {/*    {validEmpName && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">
                Employee Name should be in alphabets </Text>} */}
                    <View className={`${tailwind.viewWrapper}`}>
                        <SelectList
                            data={units}
                            setSelected={setSubunitSelected}
                            placeholder='Select Unit/Subunit'
                            placeholderTextColor='#fff'
                            inputStyles={{
                                //  padding: 0,
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
                            value={email}
                            onChangeText={text => handleCheckEmail(text)}
                            //  onChangeText={(text) => setEmail( email)}
                            placeholder="Email"
                            autoCapitalize='none'
                            autoCorrect={false}
                        />

                    </View>
                    {checkValidEmail && (<Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Wrong Format email</Text>)}
                    {/*}  : (
                        <Text className="text-[#ff0000]"></Text>)
                     <View className={`${tailwind.viewWrapper}`}>
                         <SelectList
                            data={units}
                            setSelected={setSubunitSelected}
                            placeholder='Select Unit/Subunit'
                            placeholderTextColor='#000'
                            inputStyles={{
                              //  padding: 0,
                              //  margin: 0,
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
                      </View> */}
                    {/* <Picker
                           selectedValue={setSubunitSelected}
                            onValueChange={(itemValue) => setSubunitSelected(itemValue)}
                            placeholder='Select Unit/Subunit'
                         >
                        <Picker.Item label="Java" value="java" />
                        <Picker.Item label="JavaScript" value="js" />
                        <Picker.Item label="Python" value="python" />
                        <Picker.Item label="Ruby" value="ruby" />
                    </Picker> */}

                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs}`}
                            onChangeText={value => checkPasswordValidity(value)}
                            //onChangeText={(text) => setPassword(text)}
                            placeholder="Password"
                            autoCapitalize='none'
                            secureTextEntry={true}
                            autoCorrect={false}
                        />
                    </View>
                    {validpassword && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Password must be 8-16 characters long</Text>}
                    {validpassword1 && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Password shouldn`t contain space</Text>}

                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs}`}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm Password"
                            autoCapitalize='none'
                            secureTextEntry={true}
                            autoCorrect={false}
                        />
                    </View>
                    {validconfirmPassword ? (<Text className="text-[#ff0000]"></Text>)
                        : (<Text className=" text-red-500">Password should match</Text>)}


                    <View className={`${tailwind.viewWrapper}`}>

                        <TouchableOpacity
                            className={`${tailwind.buttonBlue}`}
                            onPress={() => { handleSignUp(empId, email, password, name, subunitSelected) }}
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
