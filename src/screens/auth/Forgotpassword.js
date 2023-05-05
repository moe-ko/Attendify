import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Pressable
} from 'react-native';
import { ROUTES } from '../..';
import tailwind from '../../constants/tailwind';
import { firebase } from '../../../config'
import { Avatar } from '@rneui/base'
import { COLORS } from '../..';


const ForgotPasswordMsg = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState(false);
    const forgetPassword = () => {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                setEmailSent(true)
            })
            .catch(e => {
                setError(true)
            })
    }
    return (
        <KeyboardAvoidingView behavior="position">

            <View className={`${tailwind.container} h-screen`}>
                <View>
                    <View className="mt-44 mb-9">
                        <Text className={`${tailwind.titleText}`}>Forgot Password?</Text>
                    </View>
                    <View>
                        {emailSent ? (
                            <Avatar
                                icon={{
                                    name: 'done',
                                    type: 'material',
                                    size: 40,
                                    color: COLORS.primary
                                }}
                            />
                        ) : null}
                        <Text className={`${tailwind.slogan} mb-7`} >
                            {emailSent ? `An email has been sent to ${email}, please check your inbox` : `Please enter the email address associated with your account`}
                        </Text>
                        {!emailSent ? (
                            <TextInput
                                className={`${tailwind.inputs} w-fit h-14`}
                                placeholder={'Email ID'}
                                onChangeText={(text) => { setError(false), setEmail(text) }}
                                placeholderTextColor={'#aaa'}
                                value={email}
                            />
                        ) : null}
                        {error ? (
                            <Text className={`${tailwind.slogan} tracking-wide text-[${COLORS.red}] mt-[7]`} > No email found, please try again</Text>
                        ) : null}
                        <View className="mt-10">
                            <Pressable
                                className={`${tailwind.buttonBlue} h-14 w-fit`}
                                onPress={() => emailSent ? navigation.navigate(ROUTES.SIGNIN) : forgetPassword()}
                                disabled={(!email.trim())}
                            >
                                <Text className={`${tailwind.buttonWhiteText}`}>{emailSent ? `Ok` : `Request password`}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}




export default ForgotPasswordMsg;

