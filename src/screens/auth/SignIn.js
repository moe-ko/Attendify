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


    const style = {
        containerWrapper: 'bg-[#62ABEF] pt-32',
        container: 'bg-[#ECF0F3] w-full h-full rounded-t-[50] items-center px-4',
        title: 'w-full flex-row justify-center py-20',
        titleText: 'font-bold text-3xl',
        viewWrapper: 'w-full mb-[20]',
        inputs: 'p-[15] bg-white rounded-2xl',
        blueTextLink: 'text-[#62ABEF] font-bold',
        buttonBlue: 'p-[15] b-[7] mb-16 bg-[#62ABEF] rounded-2xl justify-center',
        buttonBlueText: 'text-white font-bold text-xl text-center',
    }

    return (
        <View className={`${style.containerWrapper}`}>
            <View className={`${style.container}`}>
                <View className={`${style.title}`}>
                    <Text className={`${style.titleText}`}>Sign In</Text>
                </View>
                <View className={`${style.viewWrapper}`}>
                    <TextInput
                        className={`${style.inputs}`}
                        value={email}
                        placeholder={'Employee ID'}
                        onChangeText={(text) => setEmail(text)}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        required
                    />
                </View>
                <View className={`${style.viewWrapper}`}>
                    <TextInput
                        className={`${style.inputs}`}
                        value={password}
                        placeholder={'Password'}
                        secureTextEntry
                        onChangeText={(text) => setPassword(text)}
                        autoCorrect={false}
                        required
                    />
                </View>
                <View className={`${style.viewWrapper}`}>
                    <Text className={`${style.blueTextLink}`}>Forgot Password?</Text>
                </View>
                <View className={`${style.viewWrapper}`}>
                    <TouchableOpacity
                        className={`${style.buttonBlue}`}
                        onPress={() => { signInUser('test@test.com', '123456') }}
                    // onPress={() => { signInUser(email, password) }}
                    // disabled={(!email.trim() || !password.trim())}
                    >
                        <Text className={`${style.buttonBlueText}`}>Sign In</Text>
                    </TouchableOpacity>
                </View>
                <View className={`${style.viewWrapper} absolute bottom-5`} >
                    <Text>New User?</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Sign Up') }}>
                        <Text className={`${style.blueTextLink}`} > Sign Up here</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
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
