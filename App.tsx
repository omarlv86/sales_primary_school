import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './src/screens/HomeScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';

// Pantallas
//import HomeScreen from './src/screens/HomeScreen';
//import ProfileScreen from './src/screens/ProfileScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Register" component={RegisterScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}