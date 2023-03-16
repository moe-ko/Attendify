import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import { firebase } from '../../../config'
const CurrentEvent = () => {
    const [currentEvent, setCurrentEvent] = useState();
    const [locationName, setLocationName] = useState();
    useEffect(() => {
        getCurrentEvent();
        // getLocationName(currentEvent.)

    }, [])

    // console.log()

    getCurrentEvent = () => {
        firebase.firestore()
            .collection('events')
            .get()
            .then(querySnapshot => {
                let event_data = []
                querySnapshot.forEach(documentSnapshot => {
                    event_data.push({
                        id: `${documentSnapshot.id}`,
                        passcode: `${documentSnapshot.data()["passcode"]}`,
                        location: documentSnapshot.data()["location"]
                    });
                });
                setCurrentEvent(event_data)
            });
    }

    getLocationName = (location_id) => {
        firebase.firestore()
            .collection('locations')
            .doc(location_id)
            .get()
            .then(documentSnapshot => {
                setLocationName(documentSnapshot.data()['name']);
            });
    }

    const Item = ({ title }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{locationName}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
    return (
        <FlatList
            data={currentEvent}
            renderItem={({ item }) => <Item title={item.passcode} />}
            keyExtractor={item => item.id}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
export default CurrentEvent