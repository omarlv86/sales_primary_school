import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, ToastAndroid} from 'react-native';
import React, { useState }from 'react'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Button, Input, Overlay } from 'react-native-elements';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'miBD.db' });

export const  RegisterScreen  = () => {

  const [date, setDate] = useState(dayjs().format('DD/MM/YYYY'));
  const [modalVisible, setModalVisible] = useState(true)
  const [number, onChangeNumber] = React.useState('');
  //console.log(dayjs().format('YYYY-MM-DD'))
  //console.log('año: ',dayjs().format('YYYY'))

  const saveSale = (sale) => {
    try {
      if(sale != ''){
        const fecha_venta = dayjs().format('YYYY-MM-DD')
        //console.log('Guardar registro: ',sale, fecha_venta)
        const query = `INSERT INTO ventas (venta, fecha_venta) VALUES (${sale}, '${fecha_venta}');`
        //console.log(query)
        db.transaction(tx => {
          tx.executeSql(query, [], (tx, results) => {
            ToastAndroid.showWithGravity(
              'Registro agregado con éxito.',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            console.log('Registro agregado con éxito');
            onChangeNumber('');
          }, error => {
            console.error('Error al agregar registro:', error);
          });
        });
      }
    } catch (error) {
      console.log(error)
    }
    
  }

  const agregarRegistro = () => {
    db.transaction(tx => {
      tx.executeSql(`
        INSERT INTO ventas (venta, fecha_venta)
        VALUES (?, ?);
      `, [venta, fechaVenta], (tx, results) => {
        console.log('Registro agregado con éxito');
        onChangeNumber('');
        //setFechaVenta('');
      }, error => {
        console.error('Error al agregar registro:', error);
      });
    });
  };



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
          onPress={() => saveSale(number)}
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
  input:{
    color:'black'
  }
});