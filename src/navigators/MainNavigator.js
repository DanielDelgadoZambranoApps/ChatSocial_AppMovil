
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import UploadItemScreen from '../screens/UploadItemScreen'
import RegisterScreen from '../screens/RegisterScreen'
import SplashScreen from '../screens/SplashScreen'
import CreateGroup from '../screens/CreateGroup'
import LoginScreen from '../screens/LoginScreen'
import DrawerNavigator from './DrawerNavigator'
import ChatScreen from '../screens/ChatScreen'

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as eva from '@eva-design/eva'

const Stack = createStackNavigator();

const MainNavigator = ({navigation}) => {

  return(
    <>
    <IconRegistry icons={EvaIconsPack}/>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName='SplashScreen'
            screenOptions={({route}) =>({
              headerTintColor:'white',
              activeTintColor: '#52B11E',
              headerTitleAlign:'center',
              headerStyle:{backgroundColor:'#52B11E'},
              drawerStyle:{width:220},
              headerTitleStyle:{fontSize:20},
            // drawerLabel:route.name
            headerShown:true
            })}>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{title:'Chat', unmountOnBlur:true}}  />
            <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown:false }} />   
            <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown:false }} />  
            <Stack.Screen name='DrawerNavigator' component={DrawerNavigator} options={{ headerShown:false }} />  
            <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown:false }} />  
            <Stack.Screen name='CreateGroup' component={CreateGroup} options={{title:'', headerShown:true }} />  
            <Stack.Screen name='UploadItemScreen' component={UploadItemScreen} options={{ title:'', headerShown:false }} />  
        </Stack.Navigator>
      </NavigationContainer> 
    </ApplicationProvider>
    </>
  )}

export default MainNavigator;