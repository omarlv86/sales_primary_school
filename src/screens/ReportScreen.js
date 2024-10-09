import { Text, View, FlatList, StyleSheet, StatusBar} from 'react-native'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import SQLite from 'react-native-sqlite-storage';
import { Dropdown } from 'react-native-element-dropdown';

const db = SQLite.openDatabase({ name: 'miBD.db' });


export const  ReportScreen  = () => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const data = [
        { label: 'Enero', value: '1' },
        { label: 'Febrero', value: '2' },
        { label: 'Marzo', value: '3' },
        { label: 'Abril', value: '4' },
        { label: 'Mayo', value: '5' },
        { label: 'Junio', value: '6' },
        { label: 'Julio', value: '7' },
        { label: 'Agosto', value: '8' },
        { label: 'Septiembre', value: '9' },
        { label: 'Octubre', value: '10' },
        { label: 'Noviembre', value: '11' },
        { label: 'Diciembre', value: '12' },
      ];
    const [month, setMonth] = useState(dayjs().format('M'));
    const [year, setYear] = useState(dayjs().format('YYYY'));
    
    const [value, setValue] = useState(dayjs().format('M'));
    const [isFocus, setIsFocus] = useState(false);
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        obtenerVentas();
    }, [month]);

    const obtenerVentas = () => {
        const query = `SELECT * FROM ventas WHERE fecha_venta >= '${year}-${month}-01' and fecha_venta <= '${year}-${month}-31'`
        console.log(query)
        db.transaction(tx => {
        tx.executeSql(query, [], (tx, results) => {
            console.log(results.rows)
            const ventas = [];
            for (let i = 0; i < results.rows.length; i++) {
            ventas.push(results.rows.item(i));
            }
            setVentas(ventas);
        }, error => {
            console.error('Error al obtener ventas:', error);
        });
        });
    };

    const Item = ({venta, fecha}) => (
        <View style={styles.row}>
          <View style={{borderColor:'gray', borderWidth:1, width:'50%'}}>
            <Text style={styles.title}>$ {venta}</Text>
          </View>
          <View style={{borderColor:'gray', borderWidth:1, width:'50%'}}>
            <Text style={styles.title}>{fecha}</Text>
          </View>
        </View>
    );

    return (
      <View style={{marginHorizontal:10}}>
        <View style={{alignItems:'center', top:10, }}>
            <Text style={{fontSize:20, color:'#000'}}>Reporte de ventas del periodo de {meses[month-1]}</Text>
        </View>
        <View style={{marginTop:20, }}>
            <Text style={{fontSize:16}}>Selecciona el mes</Text>
        </View>
        <View>
            <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select item' : '...'}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                setValue(item.value);
                setMonth(item.value);
                setIsFocus(false);
            }}
            />
        </View>
        <View style={{top:15}}>
            <FlatList
                data={ventas}
                renderItem={({item}) => <Item venta={item.venta} fecha={item.fecha_venta}/>}
                keyExtractor={item => item.id}
            />
        </View>
      </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#fff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 18,
      textAlign:'center',
      padding:5
    },
    row: {
        display:'flex',
        backgroundColor:'white',
        flexDirection:'row'
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      icon: {
        marginRight: 5,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
  });