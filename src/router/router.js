/* eslint-disable prettier/prettier */
import { HomeScreen } from "../../src/screens/HomeScreen";
import { RegisterScreen } from "../../src/screens/RegisterScreen";


export const menu = [
    {
        title:'Inicio',
        route:'Home',
        icon:'home',
        component: HomeScreen,
        render:true,
        registroApp:"1",
    },
    {
        title:'Mi Sipac',
        route:'Sipac',
        icon:'desktop-mac',
        component: RegisterScreen,
        render:true,
        registroApp:"1",
    },
]