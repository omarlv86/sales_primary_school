import { Text, View } from 'react-native'
import React from 'react'

export const  HomeScreen  = () => {
    return (
      <View style={{flex:1, alignContent:'center', alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:20, fontWeight:'400'}}>Aplicación para el registro de ventas de bebidas en la escuela.</Text>
      </View>
    )
    
}