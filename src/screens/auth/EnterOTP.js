import React, { Component } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import tailwind from '../../constants/tailwind'
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, ROUTES } from '../..';

const EnterOTP = ({ navigation }) => {
  resendOTP = () => { };

  return (
    <KeyboardAvoidingView>
      <View className={`${tailwind.containerWrapper}bg-[${COLORS.brightGrey}] items-center h-full`}>
        <View>
          <Pressable onPress={() => navigation.goBack(null)}>
            {/* <SvgIcon icon={'back'} width={30} height={30} />*/}
          </Pressable>
        </View>
        <View>
          {/*<View style={styles.loginIcon}>
                    {/*<SvgIcon icon={'enterOtp'} width={280} height={280} />
          </View>*/}
          <View className="mt-16">
            <View style={styles.loginLblCon}>
              <Text style={styles.loginLbl}>Enter OTP?</Text>
            </View>
            <View style={styles.forgotDes}>
              <Text style={styles.forgotDesLbl}>
                An 4 digit code has been sent to
              </Text>
              <Text style={styles.forgotDesLbl}>+91 1234567890</Text>
            </View>
            <View style={styles.formCon}>
              <OTPInputView
                pinCount={4}
                autoFocusOnLoad
                style={{ width: '80%', height: 70 }}
                codeInputFieldStyle={{ color: COLORS.primary }}
                onCodeFilled={code =>
                  navigation.navigate(ROUTES.RESET_PASS)
                }
              />
              <TouchableOpacity onPress={() => this.resendOTP()} className={`${tailwind.buttonBlue} mt-7`}>
                <Text className={`${tailwind.buttonWhiteText}`}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: '#fff',
    flex: 1,
  },
  loginIcon: {
    alignSelf: 'center',
  },
  formCon: {
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  loginLblCon: {
    position: 'relative',
    bottom: 40,
  },
  loginLbl: {
    color: '#000',
    fontSize: 40,

  },
  forgotDes: {
    position: 'relative',
    bottom: 35,
  },
  forgotDesLbl: {
    color: '#000',

  },

});
export default EnterOTP;