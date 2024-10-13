import { Text, View, FlatList, StyleSheet, StatusBar, ScrollView, TouchableOpacity, PermissionsAndroid, ToastAndroid, Platform} from 'react-native'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import SQLite from 'react-native-sqlite-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { map } from 'lodash';
import Pdf from 'react-native-pdf';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const db = SQLite.openDatabase({ name: 'miBD.db' });

var RNFS = require('react-native-fs');
import XLSX from 'xlsx'


export const  ReportScreen  = () => {
    const reportIsFocused = useIsFocused();
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
    const [totalVentas, setTotalVentas] = useState(0)
    
    const [value, setValue] = useState(dayjs().format('M'));
    const [isFocus, setIsFocus] = useState(false);
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        obtenerVentas();
    }, [month, reportIsFocused]);


    const obtenerVentas = () => {
        const query = `SELECT fecha_venta, venta FROM ventas WHERE fecha_venta >= '${year}-${month}-01' and fecha_venta <= '${year}-${month}-31' ORDER BY fecha_venta`
        db.transaction(tx => {
        tx.executeSql(query, [], (tx, results) => {
            const ventas = [];
            for (let i = 0; i < results.rows.length; i++) {
            ventas.push(results.rows.item(i));
            }
            const sumaTotal = ventas.reduce((acc, objeto) => {
              return acc + parseFloat(objeto.venta);
            }, 0);
            setTotalVentas(sumaTotal)
            
            setVentas(ventas);
        }, error => {
            console.error('Error al obtener ventas:', error);
        });
        });
    };

    const agregarTotal = () => {
      // Crea una copia del array actual de ventas
      const total = [...ventas];
  
      // Agrega un nuevo objeto al array
      total.push({ fecha_venta: '', venta: totalVentas });
      return total
    };

    const exportDataToExcel = () => {

        // Created Sample data
        //let sample_data_to_export = [{id: '1', name: 'First User'},{ id: '2', name: 'Second User'}];
        newArrVentas = agregarTotal()
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(newArrVentas)    
        XLSX.utils.book_append_sheet(wb,ws,"Ventas")
        const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
    
        // Write generated excel to Storage
        //RNFS.ExternalStorageDirectoryPath
        
        RNFS.writeFile(RNFS.DownloadDirectoryPath  + `/reporte_de_ventas_${data[month-1].label}.xlsx`, wbout, 'ascii').then((r)=>{
          ToastAndroid.showWithGravity(
            'Excel guardado correctamente.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }).catch((e)=>{
          console.log('Error', e);
          ToastAndroid.showWithGravity(
            `Error ${e}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        });
    
      }


      const descargarPDF = async () => {
        const pdf = new Pdf();
        console.log(pdf)
        pdf.addPage();
        pdf.setFont('Helvetica', '12');
        ventas.forEach((dato, index) => {
          pdf.text(`Fila ${index + 1}: ${dato.venta} - ${dato.fecha_venta}`, 10, 20 + index * 10);
        });
        const archivo = await pdf.saveToDevice(`/reporte_de_ventas_${data[month-1].label}.pdf`);
        RNFS.writeFile(RNFS.DownloadDirectoryPath + `/reporte_de_ventas_${data[month-1].label}.pdf`, archivo, 'binary').then((r)=>{
          ToastAndroid.showWithGravity(
            'PDF guardado correctamente.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
         console.log('Success');
        }).catch((e)=>{
          console.log('Error', e);
        });
      };
    

      

      const handleClick = async () => {
    
        try{
          // Check for Permission (check if permission is already given or not)
          let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          console.log('isPermitedExternalStorage: ', isPermitedExternalStorage)
    
          if(!isPermitedExternalStorage){
            console.log('SOLICITAR PERMISOS')
            // Ask for permission
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: "Storage permission needed",
                buttonNeutral: "Despues",
                buttonNegative: "Cancelar",
                buttonPositive: "OK"
              }
            );
    
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Permission Granted (calling our exportDataToExcel function)
              exportDataToExcel();
              console.log("Permission granted");
            } else {
              // Permission denied
              console.log("Permission denied");
            }
          }else{
             // Already have Permission (calling our exportDataToExcel function)
             exportDataToExcel();
          }
        }catch(e){
          console.log('Error while checking permission');
          console.log(e);
          return
        }
        
      };

      const requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
            {
              title: 'Permisos de Almacenamiento',
              message:
                'Se necesitan los permisos para poder utilizar la aplicacion.',
              buttonNeutral: 'Despues',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK',
            },
          );
          console.log('granted: ',granted)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Storage');
          } else {
            console.log('Storage permission denied');
          }
        } catch (err) {
          console.warn('err:',err);
        }
      };
    
      const requestPermission = async () => {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        return granted;
      }

      console.log(dayjs('2024-10-09').format('DD-MM-YYYY'))

    return (
      <View style={{marginHorizontal:10}}>
        <View style={{alignItems:'center', top:10, }}>
            <Text style={{fontSize:20, color:'#000', textAlign:'center'}}>Reporte de ventas del periodo de {meses[month-1]}</Text>
        </View>
        <View style={{marginTop:20, }}>
            <Text style={{fontSize:16, color:'black'}}>Selecciona el mes</Text>
        </View>
        <View>
            <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue'}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Selecciona' : '...'}
            searchPlaceholder="Buscar..."
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
        <View style={[styles.row, {top:2}]}>
            <View style={{borderColor:'gray', borderWidth:1, width:'50%'}}>
                <Text style={styles.title}>Venta</Text>
            </View>
            <View style={{borderColor:'gray', borderWidth:1, width:'50%'}}>
                <Text style={styles.title}>Fecha</Text>
            </View>
        </View>
        <ScrollView style={{maxHeight:400, paddingBottom:5}}>
                {
                 map(ventas, (sale, index) => (
                    <View style={styles.row} key={index}>
                        <View style={{borderColor:'gray', borderWidth:1, width:'50%'}}>
                            <Text style={styles.title}>$ {sale.venta}</Text>
                        </View>
                        <View style={{borderColor:'gray', borderWidth:1, width:'50%'}}>
                            <Text style={styles.title}>{dayjs(sale.fecha_venta).format('DD/MM/YYYY')}</Text>
                            
                        </View>
                    </View>
                 ))
                }
                <View style={{alignItems:'center', marginVertical:10}}>
                  <Text style={{fontSize:18, color:'black'}}>La venta total es de $<Text style={{fontWeight:'bold'}}> {totalVentas}</Text></Text>
                </View>
                
                <View style={{padding:10}}>
                    <TouchableOpacity
                        onPress={() => exportDataToExcel()}
                        style={{
                        width: '50%',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        backgroundColor: '#2D572C',
                        marginVertical: 20,
                    }}>
                        <Text style={{textAlign: 'center', color: 'white'}}>
                            Guardar Excel
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => agregarTotal()}
                        style={{
                        width: '50%',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        backgroundColor: '#2D572C',
                        marginVertical: 20,
                    }}>
                        <Text style={{textAlign: 'center', color: 'white'}}>
                            Agregar total
                        </Text>
                    </TouchableOpacity> */}
                </View>
        </ScrollView>
        
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
    text: {
        fontSize: 42,
      },
    title: {
      fontSize: 18,
      textAlign:'center',
      padding:5,
      color:'black'
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
        color:'red'
      },
      selectedTextStyle: {
        fontSize: 16,
        color:'black'
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color:'red'
      },
  });