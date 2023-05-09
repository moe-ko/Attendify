import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React from 'react'
import tailwind from '../constants/tailwind'
import { ROUTES, COLORS } from '..'


const Welcome = ({ navigation }) => {
    return (
        <View className={`${tailwind.containerWrapper}`}>
            <ImageBackground source={require("../../assets/welcome-bg.png")} className="h-full my-9">
                <View className="flex-1 justify-center items-center pt-[50]">
                    <View className="justfy-center items-center" >
                        <Image source={require('../../assets/Logo.png')} className="w-24 h-24" />
                    </View>

                    <Text className="text-center font-semibold mb-10 text-4xl pt-5">
                        Attendify
                    </Text>
                    <View className={`${tailwind.viewWrapper} w-11/12 `}>
                        <TouchableOpacity
                            className={`${tailwind.buttonBlue}`}
                            onPress={() => { navigation.navigate(ROUTES.SIGNIN) }}
                        >
                            <Text className={`${tailwind.buttonWhiteText}`}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                    <View className={`${tailwind.viewWrapper} w-11/12 mb-7`}>
                        <TouchableOpacity
                            className={`${tailwind.buttonWhite}`}
                            onPress={() => { navigation.navigate(ROUTES.SIGNUP) }}>
                            <Text className={`${tailwind.buttonBlueText}`} >Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity className={``} onPress={() => Linking.openURL(`mailto:contact@attendify.com`)}>
                            <Text className={`text-center text-[${COLORS.primary}]`}>
                                Contact Us
                            </Text>
                        </TouchableOpacity> */}
                </View>
            </ImageBackground>
        </View>
    )
}

export default Welcome;
