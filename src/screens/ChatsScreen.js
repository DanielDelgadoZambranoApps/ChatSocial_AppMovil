import React, { useState, useEffect } from 'react'
import { StyleSheet, FlatList, View, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { GetCollection } from '../functions/firebase-firestore-funtions'
import { CheckConnectivity } from '../functions/general-functions'
import  ContactListItem  from '../components/ChatListItem'

const ChatsScreen = ({navigation}) => {
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);  
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  
  const [internetConnection , setInternetConnection] = useState(true)
  const [userCompleteName, setUserCompleteName] = useState()
  const [userID, setUserID] = useState()
  const [superUpdate, setSuperUpdate] = useState(true)
  const [update, setUpdate] = useState(true)

  useEffect(()=>{ 
    if(CheckConnectivity()){
      GetCurrentSpecificInfo("userCompleteName", setUserCompleteName)
      GetCurrentSpecificInfo('id', setUserID)
      GetCollection('Usuarios', setMasterDataSource)
      GetCollection('Usuarios', setFilteredDataSource)
  } else {
      GetSpecificValueFromAsyncStorage('userCompleteName', setUserCompleteName)
      GetSpecificValueFromAsyncStorage('id', setUserID)
      setInternetConnection(false)
      } 
  },[update]) 

  const onRefresh = () => {
    setRefreshing(true)
    setUpdate(!update)
    setRefreshing(false)
  };

  
  const GoToChatScreen = (chatUrl, contactName, contactID)=>{
    if(chatUrl && contactName) navigation.navigate("ChatScreen", {roomID: chatUrl, userID:userID, userName: userCompleteName, contactName:contactName, contactID:contactID })
  }
 
   const render  = (item)=>{

    let contactName = item['item'].userCompleteName
    let chatUrl = item['item'].userID  + userID
    let contactID = item['item'].userID 
    let show = true
 
    if(item['item'].userID === userID)show = false 
    if(item['item'].userID > userID) chatUrl = userID + item['item'].userID

    return(
      <>
      {  show &&  
        <>
          <TouchableOpacity onPress={()=>{GoToChatScreen(chatUrl, contactName, contactID)}  } >
            <ContactListItem user={item} superUpdate={superUpdate} />
          </TouchableOpacity>
          <View style={styles.lineStyle} />
        </>

      }
      </>
    ) 
  }
 
  const searchFilterFunction = (text) => {
    setInternetConnection(false)
    if (text) {
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item
            ? item['userCompleteName'].toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();

          return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSuperUpdate(!superUpdate)
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
    setInternetConnection(true)
  }

  return (
    <>
    { internetConnection ?
        <>
          <View style={styles.container_original} >  
          <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
            <View style={styles.box} > 
              <FlatList 
                data={filteredDataSource} renderItem={(item, index) => render(item)}
                keyExtractor={(item, index) => index}
                refreshControl={
                  <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                 />
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('CreateGroup')} }>
                <FontAwesome5 name={'plus'} size={20} color={'#ffffff'}/>
            </TouchableOpacity>
          </View>
        </>
        :
        <>
          <ActivityIndicator color="#4FAB1C"size="large" style={styles.activityIndicator}/>
        </>
    }
    </>
  )
}

export default ChatsScreen
 
const styles = StyleSheet.create({
  container_original:{
    flex:1,
    backgroundColor:"#F5FFEE" 
  },
  box:{
    width:'90%',
    height:'80%',
    backgroundColor:'#ffffff',
    alignSelf:'center',
    marginTop:20
  },
  box2:{
    marginTop: 30,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "white",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:'90%',
    width:'90%',
    alignSelf:'center'
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
  lineStyle:{ 
    borderBottomColor: 'gray',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width:'80%',
    alignSelf:'center',
    top:1
    },
  button: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#52B11E',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 80,
      right: 30,
      elevation: 5,
  },
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    width:'90%',
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#AFE28A',
    backgroundColor: '#FFFFFF',
    alignSelf:'center',
    marginTop:20
  },
})