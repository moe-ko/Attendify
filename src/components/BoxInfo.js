import React, { useState } from 'react'
import {
  View, Text
} from 'react-native'
import { COLORS } from '..';
import { Avatar } from '@rneui/themed';
import { getStatusIcon } from '../../functions';

const BoxInfo = ({ props }) => {
  const [icon, setIcon] = useState('')

  getStatusIcon(props.status).then(res => setIcon(res))

  return (
    <View style={{ width: '100%', borderRadius: 4, alignItems: 'center', marginBottom: 20 }}>
      <View style={{
        backgroundColor: props.bg,
        color: 'white',
        borderRadius: 100,
      }} >
        <Avatar size={25} rounded icon={{ name: icon, type: "material" }} color={'white'} />
      </View>
      <Text style={{ fontSize: 16, fontWeight: 600, text: 'center', color: COLORS.grey }}>
        {props.label}
      </Text>
    </View>
  )
}

export default BoxInfo