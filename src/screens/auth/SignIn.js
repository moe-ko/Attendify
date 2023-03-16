import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../../../config'

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    signInUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(error.message);
        }
    }

    return ( 
        <View className="flex-1 items-center justify-center bg-[#62ABEF] pt-40">
            <View className="bg-[#ECF0F3] w-full h-full rounded-t-[50] pt-32">
                <View className='w-full justify-center flex-row'>
                    <Text className="mb-[20] font-bold pb-[30] text-3xl">Sign In</Text> 
                </View>
                <View className='w-full px-10 mb-[20]'>
                    <TextInput
                    className="p-[15]  w-[350] bg-white rounded-2xl"
                    value={email}
                    placeholder={'Employee ID'}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize={'none'}
                    keyboardType={'email-address'}
                    required
                />
               </View>
                <View className='w-full px-10 mb-[20]'>
                <TextInput
                    className="p-[15] b-[100] mb-[15] w-[350] bg-white rounded-2xl"
                    value={password}
                    placeholder={'Password'}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    autoCorrect={false}
                    required
                    />
                </View>
                <View className='w-full px-10 mb-[20]'>
                    <Text className=" text-[#62ABEF] font-bold">Forgot Password?</Text>
                </View>
                 <View className='w-full px-10 mb-[20]'>
                    <TouchableOpacity
                        className="p-[15] b-[7] mb-16 w-[350] bg-[#62ABEF] rounded-2xl justify-center"
                        onPress={() => { signInUser('test@test.com', '123456') }}
                    // onPress={() => { signInUser(email, password) }}
                    // disabled={(!email.trim() || !password.trim())}
                    >
                        <Text className="text-white font-bold text-xl mx-auto">Sign In</Text>
                    </TouchableOpacity>
                    </View>
                <View className=" px-10 flex-row top-50 justify-center align-bottom bottom-0">
                    <Text className="text-[#454545]">New User?</Text>
                    <TouchableOpacity
                        className="text-[#62ABEF] font-bold"
                        onPress={() => { navigation.navigate('Sign Up') }}>
                            <Text className="text-[#62ABEF] font-bold"> Sign Up here</Text>
                    </TouchableOpacity>
                </View>
            </View> 
            </View>
    )
}
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
export default SignIn;
