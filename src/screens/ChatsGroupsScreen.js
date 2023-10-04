
import React, {useState, useEffect} from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, ActivityIndicator, TextInput, Alert, Text } from 'react-native'

import { getSpecificDoc, sendToAllContacts } from '../functions/firebase-firestore-funtions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { CheckConnectivity} from '../functions/general-functions'
import GroupInfoItem from '../components/GroupInfoItem'
import MyButton from '../components/MyButton'

const ChatsGroupsScreen = ({navigation}) => {
  const [ internetConnection , setInternetConnection ] = useState(true)
  const [ selectedGroupsArray, setSelectedGroupsArray ] = useState([])
  const [userCompleteName, setUserCompleteName] = useState()
  const [ contactsGroup, setContactsGroup ] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ userID, setUserID ] = useState(null)
  const [ update, setUpdate ] = useState(true)

  useEffect(()=>{ 
    if(CheckConnectivity()){
      GetCurrentSpecificInfo('id', setUserID)
      GetCurrentSpecificInfo("userCompleteName", setUserCompleteName)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
      GetSpecificValueFromAsyncStorage('userCompleteName', setUserCompleteName)
      setInternetConnection(false)
      } 
  },[])  

  useEffect(()=>{ 
    if(userID) getSpecificDoc(userID, setContactsGroup)
  },[userID, update]) 

  const sendMessagesToAll = () =>{
    if(message){
      if(message.length < 2){
        Alert.alert("Error", "Debe escribir el contenido del mensaje",
        [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
      } else {
        if(selectedGroupsArray < 1){
          Alert.alert("Error", "Debe seleccionar al menos 1 grupo ...",
          [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
        } else {
          sendToAllContacts(selectedGroupsArray, message, userID, userCompleteName, setSelectedGroupsArray, setMessage, setUpdate, update, navigation)
        }

      }
    } else {
      Alert.alert("Error", "Debe escribir el contenido del mensaje",
      [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
    }
  }

  const render  = (item)=>{
    return(
      <> 
        <TouchableOpacity>
          <GroupInfoItem item={item} selectedGroupsArray={selectedGroupsArray} setSelectedGroupsArray={setSelectedGroupsArray} />
        </TouchableOpacity>
      </>
    ) 
  }

  return (
          <>
            <View style={styles.container_original } >

            <TextInput 
            value={message}
            placeholder={'Contenido del Mensaje'}
            style={styles.textInput}
            multiline = {true}
            onChangeText={(value) => setMessage(value)}/>
              { internetConnection ?
                <>
                    { contactsGroup ?
                    <>
                    <View style={styles.box} > 
                      <FlatList data={contactsGroup} renderItem={(item, index) => render(item)} keyExtractor={(item, index) => index} />
                    </View>
                    </>   
                    :
                    <>
                     <View style={styles.box} > 
                     <Text>Aun no ha creado ningun grupo ... </Text>
                    </View>
                    </>
                    }
                </>
                :
                <>
                  <ActivityIndicator color="#4FAB1C"size="large" style={styles.activityIndicator}/>
                </>
              }
              <View style={{marginTop:20}} />
              <MyButton  title={'Enviar Mensaje a Todos'} customClick={()=> {sendMessagesToAll()} } />
            </View>
          </>
  )
}
export default ChatsGroupsScreen

const styles = StyleSheet.create({

  container_original:{
    flex:1,
    backgroundColor:"#F5FFEE" 
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
  box:{
    width:'90%',
    height:'30%',
    backgroundColor:'#ffffff',
    alignSelf:'center',
    marginTop:40,
    borderBottomColor: '#EAEAEA',
    borderTopColor:'#EAEAEA',
    borderLeftColor:'#EAEAEA',
    borderRightColor:'#EAEAEA',
    borderWidth: 1,
    borderRadius:5, 
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
  textInput: {
    textAlign: "center",
    color: "#000000",
    fontSize: 18,
    borderWidth: 1,
    borderBottomColor: '#EAEAEA',
    borderTopColor:'#EAEAEA',
    borderLeftColor:'#EAEAEA',
    borderRightColor:'#EAEAEA',
    borderRadius:5, 
    backgroundColor:'white',
    marginTop:50,
    width:'90%',
    height:'40%',
    alignSelf:'center'
  }
});

