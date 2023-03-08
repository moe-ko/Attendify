import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';

function Geolocation() {
    // Location
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);


    let text = 'Waiting...';
    let lat = 0;
    let long = 0;
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
        lat = JSON.parse(text)['coords']['latitude'];
        long = JSON.parse(text)['coords']['longitude'];
    }

    return (
        <View >
            <Text>You are here</Text>
            <Text>Latitude: {lat}</Text>
            <Text>Longitude: {long}</Text>
        </View>
    );
}
export default () => {
    return (
        <Geolocation />
    )
}