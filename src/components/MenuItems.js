import { DrawerContentScrollView } from '@react-navigation/drawer';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image } from "react-native"
import { menu } from '../resources/router';
import MenuButtonItem from './MenuButtonItem';
import { Divider } from "@rneui/themed";
import { useAuth } from '../context/AuthContext';
import { getLogoPromot } from '../storage/LogoPromotAsyncStorage';
import DeviceInfo from 'react-native-device-info';

export const MenuItems = ({navigation, state}) => {
    //const [login, loginAction]  = useAuth();
    //const { user } = login;
    //const [logo, setLogo] = useState('')

    useEffect(() => {
        getLogoPromot().then(logo =>{
          setLogo(logo)
        });
      }, [])

    return (
        <View style={{flex:1}}>
            <View style={{width:'100%', alignItems:'center', justifyContent:'center', marginVertical:20}}>
                <View style={{backgroundColor:'#E2E2E2', width:'85%'}}>
                    <Image
                    source={logo ? { uri:logo } : require('../assets/images/logo_nuvem.png')} 
                    style={{width:'100%', height:100}}
                    resizeMode="contain"
                    />
                </View>
            </View>
            <View style={{left:10}}>
                <Text style={{color:"#e2e2e2", fontSize:15, marginBottom:10}}>{user.name ? user.name : ''}</Text>
                <Text style={{color:"#e2e2e2", fontSize:12, marginBottom:15}}>{user.email ? user.email : '' }</Text>
            </View>
            <View style={{ marginVertical:10}}>
                <Divider />
            </View>
            <DrawerContentScrollView>
                <View>
                    {
                        map(menu, ({title, route, icon, render, registroApp, stt}, index) => {
                            if (render){
                                if (stt){
                                    if (user.stt){
                                        return (
                                            <MenuButtonItem
                                                key={index}
                                                text={title}
                                                icon={icon}
                                                index={index}
                                                active={state.index}
                                                register={registroApp}
                                                onPress={() => navigation.navigate(route)}
                                            />
                                        );
                                    }
                                } else {
                                    return (
                                        <MenuButtonItem
                                            key={index}
                                            text={title}
                                            icon={icon}
                                            index={index}
                                            active={state.index}
                                            register={registroApp}
                                            onPress={() => navigation.navigate(route)}
                                        />
                                    );
                                }
                            }
                        })
                    }
                </View>
            </DrawerContentScrollView>
            <View>
                <Text style={{color:'#fff', padding:4, fontSize:10}}>Versión: {DeviceInfo.getVersion()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
      width: '100%',
      height:400,
    },
});