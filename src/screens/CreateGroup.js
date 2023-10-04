import React, {useEffect, useState} from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList,Alert } from 'react-native';

import ContactListItem2  from '../components/ChatListItem2'
import CheckBoxItem  from '../components/CheckBoxItem'
import MyTextInput from '../components/MyTextInput'
import MyButton from '../components/MyButton'

import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { GetCollection, uploadGroup } from '../functions/firebase-firestore-funtions'
import { CheckConnectivity} from '../functions/general-functions'

const CreateGroup = ({navigation}) => {

  const [internetConnection , setInternetConnection] = useState(true)
  const [contactsArray, setContactsArray] = useState([])
  const [groupName, setGroupName] = useState(null)
  const [users, setUsers] =  useState(null) 
  const [userID, setUserID] = useState() 

  useEffect(()=>{ 
    if (CheckConnectivity()) {
      GetCurrentSpecificInfo('id', setUserID)
      GetCollection('Usuarios', setUsers)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
      setInternetConnection(false)
    } 
  },[]) 

  const render  = (item)=>{

    let show = true
    if(item['item'].userID === userID)show = false 
    
    return(
      <>
        {  show &&
            <>
            <TouchableOpacity onPress={()=>{}}  >
                <ContactListItem2 user={item} />
                <View style={{left:'60%'}}>
                </View>
            </TouchableOpacity>
                <CheckBoxItem item={item} setContactsArray={setContactsArray} contactsArray={contactsArray} MyuserID={userID}  />
            <View style={styles.lineStyle} />
            </>
        }
      </>
    )
  }

  const upload =()=>{

    if(groupName){
        if(contactsArray.length >1 ){
            uploadGroup(userID, groupName, contactsArray, navigation)
        } else {
            Alert.alert("Error ... ", "Los grupos deben tener al un minimo de 2 integrantes",
              [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })   
        }
        console.log("se sube la wea ")
    } else {
        Alert.alert("Operacion Invalida", "Complete todos los campos ...",
          [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })   
    }
  }

  return (
        <>
        { internetConnection ?
            <>
                <SafeAreaView style={styles.container}>
                    <View style={styles.inputContainer}> 
                        <MyTextInput param={groupName} placeholder='Nombre del Grupo' functionParam={setGroupName}/>
                    </View>
                    <View style={styles.contactBox}>
                        <FlatList data={users} renderItem={(item, index) => render(item)} keyExtractor={(item, index) => index} />
                    </View>
                    <MyButton  title={'Crear'} customClick={()=> {upload()} } />
                </SafeAreaView>  
            </>
            :
            <>
                <ActivityIndicator color="#4FAB1C"size="large" style={styles.activityIndicator}/>
            </>
        }
        </>
)}

export default CreateGroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5FFEE"
    },
    inputContainer: {
        margin: 30,
        backgroundColor:'#ffffff'
    },
    textInput: {
        height: 42,
        textAlign: "center",
        color: "#333333",
        fontSize: 18,
        borderWidth: 1,
        borderBottomColor: "#111111",
        marginBottom:30,
        borderRadius:5
    },
    textInput2: {
        height: 300,
        textAlign: "center",
        color: "#333333",
        marginBottom: 10,
        fontSize: 18,
        borderWidth: 1,
        borderBottomColor: "#111111",
        borderRadius:10,
        marginTop:40
    },
    view:{
        alignSelf:'center',
        marginTop:120,
        width:350,
        
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#52B11E',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 100,
        right: 15,
        elevation: 5,
    },
    text:{
        textAlign:'center'
    },
    contactBox:{
        backgroundColor:'#ffffff',
        width:'80%',
        height:'70%',
        alignSelf:'center',
        borderBottomColor: '#EAEAEA',
        borderTopColor:'#EAEAEA',
        borderLeftColor:'#EAEAEA',
        borderRightColor:'#EAEAEA',
        borderWidth:1
    },
    activityIndicator: {
        alignItems: "center",
        height: 80,
      },
    lineStyle:{ 
    borderBottomColor: 'gray',
    borderBottomWidth: 0.9,
    width:'80%',
    alignSelf:'center',
    top:1
    },
})