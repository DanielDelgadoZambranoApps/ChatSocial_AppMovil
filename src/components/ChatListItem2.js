import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'

import { CheckBox } from '@rneui/themed'; 
import { getFullStorageItemPath } from '../functions/firebase-storage-functions'

const  ChatListenItem2 = (props)=> {

   const [profilePicUrl, setProfilePicUrl] =useState(null)
   const userName = props['user']['item'].userCompleteName
   const contactID = props['user']['item'].userID
   const [loading, setLoading] = useState(true)

   useEffect(()=>{
    getFullStorageItemPath(contactID, setProfilePicUrl, setLoading) 
   },[])

  return (
    <>
        <View style={styles.container} >
            { loading ?
            <>
                <ActivityIndicator color="#4FAB1C"size="large" style={styles.activityIndicator}/>
            </>
            :
            <>
            { profilePicUrl ?
                <>
                <Image source={{uri:profilePicUrl}} style={styles.avatar} />
                </>
                :
                <>
                <Image source={require("../../assets/ProfilePic.png")} style={styles.avatar} />
                </>
            }
            </>
            }
            <View style={styles.midContainer} >
                <Text style={styles.username} > {userName} </Text>
            </View>
        </View>
        

    </>
    )
}

export default ChatListenItem2


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex:1,
    marginTop:'4%',
    left:'8%'
  },
  midContainer: {
    justifyContent: 'space-around',
  },
  avatar: {
    width: '20%',
    height: 60,
    borderRadius: 50,
    marginRight: 15,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
})

