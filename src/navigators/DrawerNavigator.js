import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ChatsGroupsScreen from '../screens/ChatsGroupsScreen'
import InventarioScreen from '../screens/InventarioScreen'
import CustomSidebarMenu from '../../CustomSidebarMenu'
import ProfileScreen from '../screens/ProfileScreen'
import ChatsScreen from '../screens/ChatsScreen'

const Drawer = createDrawerNavigator();

const  DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    initialRouteName="Inventario"
    drawerContent={(props) => <CustomSidebarMenu {...props} />}
      screenOptions={({route}) =>({
        headerTintColor:'white',
        activeTintColor: '#52B11E',
        headerTitleAlign:'center',
        headerStyle:{backgroundColor:'#52B11E'},
        drawerStyle:{width:220},
        headerTitleStyle:{fontSize:20},
        drawerLabel:route.name ,

      })}>
      <Drawer.Screen name="Inventario" component={InventarioScreen} options={{ groupName: 'MessagesCCU', unmountOnBlur:true}}  />
      <Drawer.Screen name="Chats" component={ChatsScreen} options={{ groupName: 'MessagesCCU', unmountOnBlur:true}}  />
      <Drawer.Screen name="Enviar Mensajes  " component={ChatsGroupsScreen} options={{ groupName: 'MessagesCCU', title:'Grupos', unmountOnBlur:true}}  />
      <Drawer.Screen name="Mi Cuenta" component={ProfileScreen} options={{ groupName: 'MessagesCCU', unmountOnBlur:true }}  />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator