import React, { useState, useRef } from 'react'
import { ListItem, Avatar } from '@rneui/themed';
import { Text, TouchableOpacity, View } from 'react-native';
import tailwind from '../constants/tailwind';
import { getStatusIcon } from '../../functions';
import { COLORS } from '..';
import RBSheet from "react-native-raw-bottom-sheet";
import RadioForm from 'react-native-simple-radio-button';
import { arrayUnion } from 'firebase/firestore'
import { firebase } from '../../config'


const EmployeeItem = ({ props }) => {
  const [icon, setIcon] = useState('')
  const [newAttendance, setNewAttendance] = useState()
  const refRBSheet = useRef();

  getStatusIcon(props.status).then(res => setIcon(res))

  updateEmployeeStatus = () => {
    firebase.firestore()
      .collection('events')
      .where('start', '==', props.event)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let employees = []
          switch (props.status) {
            case 'attendance':
              employees = documentSnapshot.data()['attendance']
              break;
            case 'absent':
              employees = documentSnapshot.data()['absent']
              break;
            case 'sick_leave':
              employees = documentSnapshot.data()['sick_leave']
              break;
            case 'annual_leave':
              employees = documentSnapshot.data()['annual_leave']
              break;
          }
          let index = employees.indexOf(props.id)
          employees.splice(index, 1)
          updateStatus(documentSnapshot.id, employees)
        });
      });
  }

  updateStatus = (id, newArray) => {
    let query = ''
    let union = arrayUnion(props.id)
    switch (props.status) {
      case 'attendance':
        query = { attendance: newArray }
        break;
      case 'absent':
        query = { absent: newArray }
        break;
      case 'sick_leave':
        query = { sick_leave: newArray }
        break;
      case 'annual_leave':
        query = { annual_leave: newArray }
        break;
    }
    changeStatus(id, query)
    switch (newAttendance) {
      case 0:
        query = { attendance: union }
        break;
      case 1:
        query = { absent: union }
        break;
      case 2:
        query = { sick_leave: union }
        break;
      case 3:
        query = { annual_leave: union }
        break;
    }
    changeStatus(id, query)
  }

  changeStatus = (id, query) => {
    firebase.firestore()
      .collection('events')
      .doc(id)
      .update(
        query
      )
    refRBSheet.current.close()
  }

  const bottomSheetList = [
    { label: 'Attend', value: 0 },
    { label: 'Absent', value: 1 },
    { label: 'Sick', value: 2 },
    { label: 'Holiday', value: 3 }
  ]

  return (
    <>
      <TouchableOpacity onPress={() => refRBSheet.current.open()}  >
        <ListItem.Swipeable bottomDivider>
          <Avatar rounded size={50} source={{ uri: `${props.avatar}` }} >
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
              <Avatar size={25} rounded icon={{ name: icon, type: "material" }} color={'white'} />
            </View>
          </Avatar>
          <ListItem.Content>
            <ListItem.Title className={`${tailwind.titleText} font-medium text-xl text-[#7E7E7E]`}>{props.name}</ListItem.Title>
            <ListItem.Subtitle className={`${tailwind.slogan} text-base text-[#7E7E7E]`}>{props.id}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        height={370}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType={'slide'}
        customStyles={{
          wrapper: {
            backgroundColor: "#00000033"
          },
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingHorizontal: 20
          },
          draggableIcon: {
            backgroundColor: COLORS.primary
          }
        }}
      >
        <Text className={`${tailwind.titleText} text-[${COLORS.grey}]`}>Change attendance for </Text>
        <Text className={`${tailwind.slogan} text-[${COLORS.grey}] mb-5`}>{props.name}</Text>
        <RadioForm
          radio_props={bottomSheetList}
          initial={props.status == 'attendance' ? 0 : props.status == 'absent' ? 1 : props.status == 'sick_leave' ? 2 : 3}
          buttonColor={COLORS.grey}
          animation={true}
          labelStyle={{ fontSize: 20, color: COLORS.grey }}
          onPress={(value) => { setNewAttendance(value) }}
        />
        <TouchableOpacity className={`${tailwind.buttonBlue} mt-5`} onPress={() => { updateEmployeeStatus() }} >
          <Text className={`${tailwind.buttonWhiteText}`}>Save</Text>
        </TouchableOpacity>
      </RBSheet>
    </>
  )
}

export default EmployeeItem