import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { firebase } from '../../../../config'
import { ListItem, Avatar, BottomSheet } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'
import tailwind from '../../../constants/tailwind';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS } from '../../..';

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
        if (data['status_id'] == '1') {
            icon = 'checkmark'
        }
        if (data['status_id'] == '0') {
            icon = 'close'
        }
        if (data['status_id'] == '2') {
            icon = 'pulse-outline'
        }
        if (data['status_id'] == '3') {
            icon = 'rocket-outline'
        }
        return (
            <TouchableOpacity onPress={() => { navigation.navigate('Employee') }}>
                <ListItem bottomDivider>
                    <Avatar rounded source={{ uri: `${data['avatar']}` }} />
                    <ListItem.Content>
                        <ListItem.Title>{data['full_name']}</ListItem.Title>
                        <ListItem.Subtitle style={{ color: 'gray' }}>{id}</ListItem.Subtitle>
                    </ListItem.Content>
                    <Icon name={icon} size={30} color={COLORS.primary} />
                </ListItem>
            </TouchableOpacity>
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
                        renderItem={(item) =>
                            <Item id={item.item['data']['employee_id']} data={item.item['data']} />
                        }
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Employees