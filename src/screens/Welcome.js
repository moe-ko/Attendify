import { View, Text, TouchableOpacity, StyleSheet,Image, ImageBackground } from 'react-native'
import React from 'react'

const Welcome = ({ navigation }) => {
    return (
         <ImageBackground source={require("../../assets/pic1.png")} className="h-full">
        <View className="flex-1 justify-center items-center pt-[350]">
         <View className=" justfy-center items-center" >
          <Image source={require('../../assets/Logo.png')} className="w-24 h-24" />
        </View>
        <View className="mx-5 mb-20">
          <Text className="text-center text-black-500 font-semibold mb-10 text-4xl pt-5">
            Attendify
          </Text>
            <TouchableOpacity
                className="rounded-full pt-[15] mb-[15] w-64 bg-[#62ABEF]"
                onPress={() => { navigation.navigate('Sign In') }}
            >
                <Text className="text-center text-white font-bold pb-[10]">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="rounded-full pt-[15] w-64 bg-white mb-3"
                onPress={() => { navigation.navigate('Sign Up') }}>
                <Text className="text-center text-[#62ABEF] font-bold pb-[10]" >SignUp</Text>
            </TouchableOpacity>
            <Text className="text-center text-[#62ABEF] pt-[15] ">
            Contact Us
          </Text>
            </View>
            </View>
            </ImageBackground>
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
