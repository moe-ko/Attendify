import React from 'react'
import {
  View, Text
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../..'
import { ListItem, Avatar, BottomSheet } from '@rneui/themed';

const BoxInfo = ({ props }) => {
  const statusIcon = (status) => {
    let icon = ''
    switch (status) {
      case 'attendance':
        icon = 'done'
        break;
      case 'absent':
        icon = 'close'
        break;
      case 'sick_leave':
        icon = 'favorite'
        break;
      case 'annual_leave':
        icon = 'flight'
        break;
    }
    return icon
  }
  return (
    // <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'column', display: 'flex', width: '100%' }}>
    <View style={{ width: '100%', borderRadius: 4, alignItems: 'center', marginBottom: 20 }}>
      <View style={{
        backgroundColor: props.bg,
        color: 'white',
        borderRadius: 100,
        // shadowColor: '#000',
        // shadowOffset: { width: -2, height: 0 },
        // shadowOpacity: 0.5,
        // shadowRadius: 2,
      }} >
        <Avatar size={25} rounded icon={{ name: statusIcon(props.status), type: "material" }} color={'white'} />
      </View>
      {/* <Icon name={statusIcon(props.status)} size={20} color={COLORS.white} fontWeight='bold' /> */}
      <Text style={{ fontSize: 16, fontWeight: 600, text: 'center', color: COLORS.grey }}>
        {props.label}
      </Text>
    </View>
    // </View>
  )
}

export default BoxInfo