import * as React from 'react';
import { Button, Platform, View, Text} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen } from '../screens/HomeScreen';
import { AgentProfileScreen } from '../screens/AgentProfileScreen';
import { WalletScreen } from '../screens/WalletScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuItems } from '../components/MenuItems';
import { map } from 'lodash';
import { menu } from '../router';
import { colors } from '../theme/appTheme';

const Drawer = createDrawerNavigator();

/**
* Create MenuStack o Drawer Navigation
* @auth Ricardo Lugo | ricardo.lugo@nuvem.mx
* @date 2022-09-14
* @update 2022-11-14 Ricardo Lugo | ricardo.lugo@nuvem.mx
* @param 
* @return Drawer navigator
*/
export default function DrawerStack() {
  return (
      <Drawer.Navigator 
        initialRouteName="Home"
        backBehavior='history'
        screenOptions={{
          overlayColor: 'transparent',
          drawerActiveTintColor:colors.white,
          drawerActiveBackgroundColor: colors.primary,
          drawerInactiveTintColor:'#E2E2E2',
          drawerStyle: {
            backgroundColor: colors.primary,
          },
        }}
        drawerContent={ (props) => <MenuItems {...props}/>}
      >
        {
          map(menu, ({ route, title, component}, index) => (
            <Drawer.Screen 
              key={index}
              name={route}
              component={component} 
              options={{
                title,
                headerShown: false,
              }}
            />
          )) 
        }
      </Drawer.Navigator>
  );
}