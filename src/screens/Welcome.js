import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const Welcome = ({ navigation }) => {
    return (
        <View style={style.container}>
            <TouchableOpacity
                style={style.buttonGray}
                onPress={() => { navigation.navigate('Sign In') }}
            >
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonBlue}
                onPress={() => { navigation.navigate('Sign Up') }}>
                <Text>SignUp</Text>
            </TouchableOpacity>
        </View >
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
