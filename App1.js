import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const App =()=>{

    return(
        <>
            <View style={styles.view} >
                <Text style={styles.text} >Primera Prueba con Iconos </Text>
                <View style={{alignSelf:'center', marginTop:50}} >
                    <MaterialCommunityIcons name='guitar-electric' size={180} />
                </View> 
            </View> 
        </>
    )
}

export default App

const styles = StyleSheet.create({
    view:{
        flex:1,
        backgroundColor:'#ffffff'
    },
    text:{
        fontSize:30,
        fontWeight:'bold',
        alignSelf:'center',
        marginTop:20
    }
})
