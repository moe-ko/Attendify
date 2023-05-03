import React from 'react';
import {
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import tailwind from '../../constants/tailwind';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../..';

const ResetPassword = () => {

    return (
        <KeyboardAvoidingView behavior="position">

            <View className={`bg-[${COLORS.brightGrey}] h-full pt-10 items-center"`}>

                <View className={`${tailwind.title} mt-32`}>
                    <Text className={`${tailwind.titleText}`}>Reset Password</Text>
                </View>
                <View className="justify-center">
                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs} w-96`}
                            placeholder={'New Password'}
                            secureTextEntry
                            autoCapitalize={'none'}
                            keyboardType={'email-address'}
                            required
                        />

                    </View>

                    <View className={`${tailwind.viewWrapper}`}>
                        <TextInput
                            className={`${tailwind.inputs} w-96`}
                            placeholder={'Confirm Password'}
                            secureTextEntry
                            autoCapitalize={'none'}
                            keyboardType={'email-address'}
                            required
                        />
                    </View>



                    <View className={`${tailwind.viewWrapper}`}>
                        <TouchableOpacity
                            className={`${tailwind.buttonBlue} w-96`}
                        // onPress={() => { signInUser('test@test.com', '123456') }}
                        // onPress={() => { signInUser(email, password) }}
                        // disabled={(!email.trim() || !password.trim())}
                        >
                            <Text className={`${tailwind.buttonWhiteText}`}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}



export default ResetPassword;