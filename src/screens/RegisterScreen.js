import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, ToastAndroid} from 'react-native';
import React, { useState }from 'react'
import { Switch } from '@rneui/themed';
import dayjs from 'dayjs';
import { Button, Input, Overlay } from 'react-native-elements';
import SQLite from 'react-native-sqlite-storage';
import { DatePickerInput } from 'react-native-paper-dates';

const db = SQLite.openDatabase({ name: 'miBD.db' });

export const  RegisterScreen  = () => {

  const [date, setDate] = useState(dayjs().format('DD/MM/YYYY'));
  const [modalVisible, setModalVisible] = useState(true)
  const [number, onChangeNumber] = useState('');
  const [checked, setChecked] = useState(true);
  const [inputDate, setInputDate] = useState(new Date())
  

  const saveSale = (sale) => {
    try {
      if(sale != ''){
        let query = '';
        if(checked){
          const fecha_venta = dayjs().format('YYYY-MM-DD')
          query = `INSERT INTO ventas (venta, fecha_venta) VALUES (${sale}, '${fecha_venta}');`
        }else{
          const fecha_anterior = dayjs(inputDate).format('YYYY-MM-DD')
          query = `INSERT INTO ventas (venta, fecha_venta) VALUES (${sale}, '${fecha_anterior}');`
        }
        
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
      }else{
        ToastAndroid.showWithGravity(
          'Por favor ingresa la cantidad vendida.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        `Error: ${error}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    
  }

  
    return (
      <View style={{marginHorizontal:10}}>
        <View style={{display:'flex', flexDirection:'row', marginTop:20}}>
          <View style={{width:'70%', justifyContent:'center', }}>
            <Text style={{color:'black', fontSize:16}}>Usar la fecha actual para el registro:</Text>
          </View>
          <View style={{width:'30%', justifyContent:'center'}}>
            <Switch
              value={checked}
              onValueChange={() => setChecked(!checked)}
            />
          </View>
        </View>
        <View>
          {
            checked ? (
              <View style={{backgroundColor:'#fff', marginTop:20, borderRadius:10, marginBottom:20}}>
                <TextInput
                  style={styles.input}
                  value={dayjs()}
                  placeholder=" Ingrese la cantidad vendida el dia de hoy..."
                  keyboardType="numeric"
                  editable={false}
                />
              </View>
            ) : (
              <View style={{marginVertical:30}}>
                <DatePickerInput
                  locale="es"
                  label="Fecha"
                  value={inputDate}
                  onChange={(d) => setInputDate(d)}
                  inputMode="start"
                />
              </View>
            )
          }
        </View>
        <View>
          <Text style={{color:'black', marginTop:20, fontSize:16}}>Ingresa la cantidad vendida el dia de hoy</Text>
        </View>
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
    color:'black',
  }
});