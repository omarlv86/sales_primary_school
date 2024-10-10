import { Text, View } from 'react-native'
import React, { useEffect } from 'react'
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'miBD.db' });

const crearTablaVentas = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venta TEXT NOT NULL,
        fecha_venta DATE NOT NULL
      );
    `, [], (tx, results) => {
      console.log('Tabla creada con éxito');
    }, error => {
      console.error('Error al crear la tabla:', error);
    });
  });
};

export const  HomeScreen  = () => {

  useEffect(() => {
    crearTablaVentas();
  }, []);


    return (
      <View style={{flex:1, alignContent:'center', alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:20, fontWeight:'400', color:'black', textAlign:'center'}}>Aplicación para el registro de ventas de bebidas en la escuela.</Text>
      </View>
    )
    
}