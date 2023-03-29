import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tailwind from '../../constants/tailwind'

const UserProfile = () => {
    return (
        <View>
            <View className={`${tailwind.containerWrapper} rounded-2xl`} />
            <View className={`${tailwind.container}`}>
                <View className={`${tailwind.viewWrapper} py-10 shadow-2xl`}>
                    <TextInput
                        className={`${tailwind.inputs} h-32`}
                        // value={email}
                        placeholder={'Employee ID'}
                        // onChangeText={(text) => setEmail(text)}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        required
                    />
                </View>
                <View className={`${tailwind.viewWrapper}`}>
                    <TouchableOpacity
                        className={`${tailwind.buttonBlue} bg-black`}
                        onPress={() => { signInUser('test@test.com', '123456') }}
                    // onPress={() => { signInUser(email, password) }}
                    // disabled={(!email.trim() || !password.trim())}
                    >
                        <Text className={`${tailwind.buttonWhiteText}`}>See Vee</Text>
                    </TouchableOpacity>
                </View>
                <View className={`${tailwind.viewWrapper}`}>
                    <TouchableOpacity
                        className={`${tailwind.buttonBlue}`}
                    //  onPress={() => { signInUser('test@test.com', '123456') }}
                    // onPress={() => { signInUser(email, password) }}
                    // disabled={(!email.trim() || !password.trim())}
                    >
                        <Text className={`${tailwind.buttonWhiteText}`}>Check Attendances</Text>
                    </TouchableOpacity>
                </View>
                <View className={`${tailwind.viewWrapper} py-5 shadow-2xl`}>
                    <TextInput
                        className={`${tailwind.inputs} h-32`}
                        // value={email}
                        placeholder={'Employee ID'}
                        onChangeText={(text) => setEmail(text)}
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        required
                    />
                </View>

            </View>
        </View>

    )
}

export default UserProfile