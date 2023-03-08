import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

export const Offline = (props) => {
    return (
        <View style={style.container}>
            <Text>Offline</Text>
            <TouchableOpacity style={style.buttonBlue} onPress={props.onCheck}>
                <Text>Reload</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    buttonBlue: {
        alignItems: 'center',
        backgroundColor: '#62ABEF',
        padding: 10,
        borderRadius: 4,
        margin: 5
    },
})
