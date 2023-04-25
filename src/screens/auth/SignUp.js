import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Component } from 'react'
import React, { useState, useEffect } from 'react'
import { firebase } from '../../../config'
import { format } from 'date-fns'
import { SelectList } from 'react-native-dropdown-select-list'
import { handleSignUp } from '../../../functions'
import tailwind from '../../constants/tailwind'
import { ROUTES } from '../..'
import { Platform } from 'react-native'

const SignUp = ({ navigation }) => {

    const [empId, setEmpId] = useState('');
    const [validempId, setValidEmpId] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [checkValidEmail, setCheckValidEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [validpassword, setValidPassword] = useState(false);

    const [validpasswordSpace, setValidPasswordSpace] = useState(false);
    const [validpasswordChar, setValidPasswordChar] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validconfirmPassword, setValidConfirmPassword] = useState();
    const [error, setError] = useState('');
    const [subunitSelected, setSubunitSelected] = useState('');
    const units = []


    useEffect(() => {
        getSubunits()
    })


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

        // let re = /\S+@\S+\.\S+/;
        // let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        let regex = /^[a-z]+\.[a-z]+(@infosys.com)$/;
        setEmail(text);
        if (regex.test(text)) {

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
        const isValidChar = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
        setPassword(value);


        if ((!isValidLength.test(value))) {

            setValidPassword(true);

        }
        else {
            setValidPassword(false);

        }
        if (!isNonWhiteSpace.test(value)) {
            setValidPasswordSpace(true);
        }
        else {
            setValidPasswordSpace(false);
        }
        if (!isValidChar.test(value)) {
            setValidPasswordChar(true);
        }
        else {
            setValidPasswordChar(false);
        }


    };

    return (
        <ScrollView>
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
                    // onBlur={(e) => this.handleEmpId(e.target.value)}
                    />
                </View>


                {validempId ? <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Employee Id must be 8 digits </Text>
                    : null}


                <View className={`${tailwind.viewWrapper}`}>
                    <TextInput
                        //keyboardType='name-phone-pad'

                        className={`${tailwind.inputs}`}
                        onChangeText={(text) => setName(text)}
                        //onChangeText={text => handleOnchange(text, 'name')}
                        //onFocus={() => handleError(null, 'name')}
                        placeholder="Full Name"
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                </View>
                {/*    {validEmpName && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">
                Employee Name should be in alphabets </Text>} */}

                <View className={`${tailwind.viewWrapper}`}>
                    {Platform.OS == 'ios' ? (
                        <SelectList
                            data={units}
                            setSelected={setSubunitSelected}
                            placeholder='Select Unit/Subunit'
                            placeholderTextColor='#726F6F'
                            inputStyles={{
                                padding: 2,
                                margin: 0,
                                textAlign: 'left'
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
                        />) : (
                        <SelectList
                            data={units}
                            setSelected={setSubunitSelected}
                            placeholder='Select Unit/Subunit'
                            placeholderTextColor='#726F6F'
                            inputStyles={{
                                padding: 5,
                                margin: 0,
                                marginRight: 10,
                                textAlign: 'left'

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
                        />)}
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
                {checkValidEmail && (<Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">please use the email associated with @infosys.com</Text>)}

                {/* <Text className="text-[#ff0000]"></Text>)
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

                {validpasswordSpace && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Password shouldn`t contain space</Text>}
                {validpassword && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Password must be 8-16 characters long</Text>}

                {validpasswordChar && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Password should contain atleast an uppercase </Text>}
                {validpasswordChar && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Password should contain atleast a lowercase</Text>}
                {validpasswordChar && <Text className="font-medium tracking-wide text-red-500 text-xs mb-2 mt-[-7]">Password should contain atleast a number</Text>}


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
                        onPress={() => { navigation.navigate(ROUTES.SIGNIN) }}>
                        <Text className={`${tailwind.blueTextLink}`}> Sign in here</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};
export default SignUp;
