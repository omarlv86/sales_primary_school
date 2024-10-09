import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput} from 'react-native';
import React, { useState }from 'react'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Button, Input, Overlay } from 'react-native-elements';

export const  RegisterScreen  = () => {

  const [date, setDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(true)
  const [number, onChangeNumber] = React.useState('');

    return (
      <View style={{marginHorizontal:10}}>
        <View style={{backgroundColor:'#fff', marginTop:20, borderRadius:10, marginBottom:20}}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder=" Ingrese la cantidad vendida el dia de hoy..."
            keyboardType="numeric"
          />
        </View>
        
        <Button
          title="Registrar venta"
        />
      </View>
      
    )
    
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});