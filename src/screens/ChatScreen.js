import React, { useState, useCallback, useEffect } from 'react'

import { LogBox, ActivityIndicator, StyleSheet } from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { useRoute } from '@react-navigation/native'

import { GetLatestCollectionsData } from '../functions/firebase-firestore-funtions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { CheckConnectivity} from '../functions/general-functions'

LogBox.ignoreLogs(['Warning: Encountered two children with the same key'])

 const ChatScreen = ({navigation}) => {
  const [ messages, setMessages ] = useState('')
  const [ update, setUpdate ] = useState(true) 
  const route = useRoute()  

  const [userID, setUserID] = useState(null)

  useEffect(()=>{
    GetLatestCollectionsData( route.params.roomID, setMessages) 
      if(CheckConnectivity()){
          GetCurrentSpecificInfo('id', setUserID)
      } else {
          GetSpecificValueFromAsyncStorage('id', setUserID)
      }
  },[update]) 

  useEffect(() => {
     navigation.setOptions({ title: route.params.contactName})
  }, [])

  const onSend = useCallback (async (messages  = [])  => {

    let url = await storage().ref('Usuarios' + '/'+route.params.userID+'/' + 'ProfilePic').getDownloadURL().catch((e) => {
       console.log("no hay picture from the user")
     })
     if(!url){
      url="https://firebasestorage.googleapis.com/v0/b/messagesccu.appspot.com/o/Usuarios%2FnoPicture%2FNoPicture.png?alt=media&token=e1a369d5-5167-4295-9c5d-0c75b1b52e03"
     }    
    let   newUser= {    
      _id: route.params.userID,
      name: route.params.userName,
      avatar: url
    }
    firestore()
    .collection(route.params.roomID)
    .add({
      _id: messages.length + 1, 
      text: messages[0].text,
      createdAt: JSON.stringify(new Date()).replace(/['"]+/g, '') , 
      date:new Date() ,
      user:newUser ,
    })
    .then(() => {
      console.log("Mensaje Enviado!")
    })
    setUpdate(!update)
  }, [])

  return (
    <>
    { messages ? 
    <>
      <GiftedChat 
        messages={messages}
        onSend={messages => onSend(messages)} user={{ _id:route.params.userID }}
        renderBubble={props => {
                  return (  <Bubble {...props} wrapperStyle={{ right: {backgroundColor: '#9C9C9C'} }} />)}} 
      />
    </>
    :
    <>
      <ActivityIndicator color="#4FAB1C"size="large" style={styles.activityIndicator}/>
    </>
    }
      
    </>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
})
