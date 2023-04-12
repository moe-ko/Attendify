import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { firebase } from '../../../../config'
import { ListItem, Avatar, BottomSheet } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'
import tailwind from '../../../constants/tailwind';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, ROUTES } from '../../..';

const Employees = ({ navigation }) => {
    const [filteredData, setFilteredData] = useState([])
    const [masterData, setMasterData] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchEmployees()
        return () => { }
    }, [])

    const fetchEmployees = () => {
        firebase.firestore()
            .collection('employees')
            .where('email', '!=', firebase.auth().currentUser?.email)
            .onSnapshot(docs => {
                let emp = []
                docs.forEach(doc => {
                    emp.push({ data: doc.data() })
                })
                setFilteredData(emp)
                setMasterData(emp)
            })
    }

    const searchFilter = (text) => {
        if (text) {
            const newData = masterData.filter((item) => {
                const itemName = item['data']['full_name'] ? (item['data']['full_name']).toLowerCase() : ''
                const itemId = item['data']['employee_id'] ? item['data']['employee_id'] : ''
                const textData = text
                if (parseInt(text)) {
                    return itemId.indexOf(textData) > -1
                } else {
                    return itemName.indexOf(textData.toLowerCase()) > -1
                }
            })
            setFilteredData(newData);
            setSearch(text)
        } else {
            setFilteredData(masterData);
            setSearch(text)
        }
    }

    const Item = ({ id, data }) => {
        let icon = ''
        switch (data['status_id']) {
            case '0':
                icon = 'close'
                break;
            case '1':
                icon = 'done'
                break;
            case '2':
                icon = 'flight'
                break;
            case '3':
                icon = 'favorite'
                break;
        }
        return (
            <TouchableOpacity onPress={() => { navigation.navigate(ROUTES.EMPLOYEE, data) }}>
                <ListItem bottomDivider>
                    <Avatar rounded size={50} source={{ uri: `${data['avatar']}` }} >
                        <View style={{
                            position: 'absolute', top: 30, left: 30, backgroundColor: COLORS.primary, color: 'white', borderRadius: 100,
                            shadowColor: '#000',
                            shadowOffset: { width: -2, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 10,
                        }} >
                            <Avatar size={25} rounded icon={{ name: icon, type: "material" }} color={'white'} />
                        </View>
                    </Avatar>
                    <ListItem.Content>
                        <ListItem.Title>{data['full_name']}</ListItem.Title>
                        <ListItem.Subtitle style={{ color: 'gray' }}>{id}</ListItem.Subtitle>
                    </ListItem.Content>
                    {/* <Icon name={icon} size={30} color={COLORS.primary} /> */}
                </ListItem>
            </TouchableOpacity >
        )
    }

    return (
        <SafeAreaView>
            <View>
                <View className={`${tailwind.viewWrapper}`}>
                    <TextInput
                        value={search}
                        onChangeText={(text) => searchFilter(text)}
                        placeholder="Search by ID or Name"
                        autoCapitalize='none'
                        autoCorrect={false}
                        className={`${tailwind.inputs}`}
                    />
                </View>
                <ScrollView marginBottom={50}>
                    <FlatList
                        data={filteredData}
                        keyExtractor={item => item['data']['employee_id']}
                        renderItem={(item) => <Item id={item.item['data']['employee_id']} data={item.item['data']} />}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Employees