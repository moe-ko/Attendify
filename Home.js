import { View,StyleSheet, Text } from 'react-native'
import React from 'react'
import Background from './Background'
import { darkGreen, green } from './Constants'
import Button from './Button'


const Home = (props) => {
  return (
    <Background>
    <View style={{marginHorizontal:40,marginVertical:100}}>
      <Text style={{color:'white',fontSize:64, marginVertical:40}}>
        Attendify
      </Text>
     
     {/*} <Button bgColor='white' textColor='grey' 
              buttonLabel='Login' Press={()=>props.navigation.navigate("Login")}/>
      <Button bgColor='white' textColor='grey' 
  buttonLabel='Signup' Press={()=>props.navigation.navigate("Signup")}/>*/}
    </View>
    </Background>
  )
}

const styles=StyleSheet.create({})

export default Home