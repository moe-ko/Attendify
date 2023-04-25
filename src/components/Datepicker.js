import React, { useState } from 'react'
import { View, Modal, StyleSheetProperties, Text, TouchableHighlight, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { COLORS } from '..'

const Datepicker = (props) => {
    const { textStyle } = props
    const [date, setDate] = useState(moment())
    const [show, setShow] = useState(false)
    const onChange = (e, selectedDate) => {
        setDate(moment(selectedDate))
        console.log(date)
    }
    return (
        <TouchableHighlight
            activeOpacity={0}
            onPress={() => setShow(true)}
        >
            <View>
                <Text style={textStyle}>{moment().format('YYYY-MM-DD')}</Text>
                <Modal
                    transparent={true}
                    animationType='slide'
                    visible={show}
                    supportedOrientations={['portrait']}
                    onRequestClose={() => setShow(false)}
                >
                    <View style={{ flex: 1 }}>
                        <TouchableHighlight
                            style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}
                            activeOpacity={1}
                            visible={show}
                            onPress={() => setShow(false)}
                        >
                            <TouchableHighlight
                                underlayColor={COLORS.white}
                                style={{ flex: 1, borderColor: COLORS.rgb, borderTopWidth: 1 }}
                                onPress={() => console.log('Datepicker clicked')}
                            >
                                <View style={{ backgroundColor: COLORS.white, height: 256, overflow: 'hidden' }}>
                                    <View style={{ marginTop: 20 }}>
                                        <DateTimePicker
                                            timeZoneOffsetInMinutes={0}
                                            value={new Date(date)}
                                            mode='date'
                                            minimumDate={new Date(moment().subtract(120, 'years').format('YYYY-MM-DD'))}
                                            maximumDate={new Date(moment().format('YYY-MM-DD'))}
                                            onChange={onChange}
                                        />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>
        </TouchableHighlight>
    )
}
Datepicker.defaultProps = {
    textStyle: {}
}


export default Datepicker