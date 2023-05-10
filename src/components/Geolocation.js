import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';

function Geolocation() {
    // Location
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [address, setAddress] = useState(null)

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
        getData()

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


    getData = () => {
        Geocoder.init('AIzaSyDIhRlnq04Z60UgF6b4_fxM1q_PQD0UDAM')
        Geocoder.from(41.89, 12.49)
            .then(json => {
                var addressComponent = json.results[0].address_components[0];
            })
            .catch(error => console.warn(error));
    }

    return (
        <View>
            <Text>You are here</Text>
            <Text>Latitude: {lat}</Text>
            <Text>Longitude: {long}</Text>
            <Text>Address: {address}</Text>
        </View>
    );
}
export default () => {
    return (
        <Geolocation />
    )
}