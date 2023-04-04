import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native'
import React from 'react'
import tailwind from '../constants/tailwind'
import { ROUTES } from '..'
import { ScrollView } from 'react-native-gesture-handler'

const Welcome = ({ navigation }) => {
    return (
        <ScrollView>
            <ImageBackground source={require("../../assets/pic1.png")} className="h-full">
                <View className="flex-1 justify-center items-center pt-[450]">
                    <View className=" justfy-center items-center" >
                        <Image source={require('../../assets/Logo.png')} className="w-24 h-24" />
                    </View>
                    <View className={`${tailwind.container}`}>
                        <Text className="text-center text-black-500 font-semibold mb-10 text-4xl pt-5">
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
                        <Text className="text-center text-[#62ABEF]">
                            Contact Us
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </ScrollView>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 36,
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
export default Welcome;
