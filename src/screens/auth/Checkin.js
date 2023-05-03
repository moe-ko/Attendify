import { View, Text, Background } from 'react-native'
import React from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import tailwind from '../../constants/tailwind'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../..'
export default function Checkin() {
    return (

        <View className={`${tailwind.container} justify-center`}>

            <TouchableOpacity className={`bg-[${COLORS.white}] mt-10 h-fit rounded-3xl w-96  items-center  shadow-md"`}
            >
                <View className="pr-16">
                    <View className="flex-row mt-4">
                        <Icon name="location-outline" size={45} color={COLORS.primary} />
                        <Text className={`${tailwind.inputs} text-xl text-[${COLORS.silver}]`}>
                            Canary Wharf Office</Text>
                    </View>
                    <View>
                        <Text className={`${tailwind.inputs} text-2xl text-[${COLORS.grey}]`}>Latest event</Text>
                    </View>
                </View>
                <View className="justify-center align-middle items-center">
                    <TouchableOpacity className={`bg-[${COLORS.primary}] mt-[10] h-48 mb-5 rounded-3xl w-80 items-center justify-center shadow-md`}>
                        <View>
                            <Text className={`${tailwind.textLine} mt-5 mb-3`}

                            >Bench Enablement Program</Text>
                        </View>
                        <View>
                            <Text className={`${tailwind.textLine}`}
                            >2 minutes to check-in</Text>
                        </View>
                        <View>
                            <TextInput className={`${tailwind.inputs} w-60 items-center text-xl text-center`} placeholder='Enter the code'
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className={`${tailwind.buttonBlue} w-60 mb-4`}>
                        <View>
                            <Text className={`${tailwind.buttonWhiteText}`}>Attendify</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className={`${tailwind.buttonBlue} w-60 mb-20`}>
                        <View>
                            <Text className={`${tailwind.buttonWhiteText}`}>Check Attendences</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>

        </View>
    )
}