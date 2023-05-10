import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { firebase } from '../../../../config'
import { ListItem, Avatar } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons'
import tailwind from '../../../constants/tailwind';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, ROUTES } from '../../..';
import { getStatusIcon } from '../../../../functions';

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
        const [icon, setIcon] = useState('')

        getStatusIcon(data['status_id']).then(res => setIcon(res))

        return (
            <TouchableOpacity onPress={() => { navigation.navigate(ROUTES.EMPLOYEE, data) }}>
                <ListItem bottomDivider>
                    <Avatar rounded size={50} source={{ uri: `${data['avatar']}` }} >
                        <View style={{
                            position: 'absolute',
                            top: 30,
                            left: 30,
                            backgroundColor: icon == 'done' ? COLORS.blue900 : icon == 'close' ? COLORS.blueA700 : icon == 'favorite' ? COLORS.primary : COLORS.lightblue700,
                            color: 'white',
                            borderRadius: 100,
                            shadowColor: '#000',
                            shadowOffset: { width: -2, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 10,
                        }} >
                            <Avatar size={25} rounded icon={{ name: icon, type: "material" }} color={COLORS.white} />
                        </View>
                    </Avatar>
                    <ListItem.Content>
                        <ListItem.Title className={`${tailwind.titleText} font-medium text-xl text-[${COLORS.grey}]`}>{data['full_name']}</ListItem.Title>
                        <ListItem.Subtitle className={`${tailwind.slogan} text-base text-[${COLORS.grey}]`}>{id}</ListItem.Subtitle>
                    </ListItem.Content>
                    {/* <Icon name={icon} size={30} color={COLORS.primary} /> */}
                </ListItem>
            </TouchableOpacity >
        )
    }

    return (
        <SafeAreaView >
            <View className={`bg-[${COLORS.brightGrey}] min-h-screen`}>
                <View className={`${tailwind.viewWrapper} bg-[#FFFFFF] rounded-b-3xl items-center  py-4 justify-center`} style={{
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}>
                    <View className={`${tailwind.inputs} bg-[${COLORS.brightGrey}] w-11/12 flex-row justify-between`}>
                        <Icon name="ios-search" size={20} color="#000" className={`w-1/12`} />
                        <TextInput
                            value={search}
                            onChangeText={(text) => searchFilter(text)}
                            placeholder="Search by ID or Name"
                            autoCapitalize='none'
                            autoCorrect={false}
                            className={`w-11/12`}
                            placeholderTextColor='gray'
                        />
                    </View>
                </View>
                <ScrollView>
                    <FlatList marginBottom={400}
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