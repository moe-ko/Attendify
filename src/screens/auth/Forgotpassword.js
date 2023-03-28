import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Pressable
} from 'react-native';
import { ROUTES } from '../..';
import tailwind from '../../constants/tailwind';


const ForgotPasswordMsg = ({ navigation }) => {

    return (
        <KeyboardAvoidingView behavior="position">

            <View className="bg-[#ECF0F3] mx-5">
                <View>
                    <View className=" mt-44 mb-9">
                        <Text className={`${tailwind.titleText}`}>Forgot Password?</Text>
                    </View>
                    <View>
                        <View>
                            <Text className={`${tailwind.slogan} mb-7`} >
                                Please enter the email address associated
                                with your account
                            </Text>
                        </View>



                        <View>
                            <TextInput
                                className={`${tailwind.inputs} w-fit h-14`}
                                placeholder={'Email ID'}
                                placeholderTextColor={'#aaa'}
                            />

                        </View>

                        <View className="mt-10">
                            <Pressable
                                className={`${tailwind.buttonBlue} h-14 w-fit`}
                                onPress={() => navigation.navigate(ROUTES.ENTER_OTP)}
                            >
                                <Text className={`${tailwind.buttonWhiteText}`}>Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}




export default ForgotPasswordMsg;

