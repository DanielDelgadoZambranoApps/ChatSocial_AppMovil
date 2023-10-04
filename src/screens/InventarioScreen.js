import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { CheckConnectivity } from '../functions/general-functions'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Button } from '@ui-kitten/components'

import { GetCollection, BuyItem, BuyItem2 } from '../functions/firebase-firestore-funtions'
import ItemImages from '../components/ItemImages'

const InventarioScreen = ({navigation}) => {
      
  const [internetConnection , setInternetConnection] = useState(true)
  const [items, setItems] = useState(null)

  useEffect(()=>{ 
    if(CheckConnectivity()){
        GetCollection('Items', setItems)
  } else {
      setInternetConnection(false)
      } 
  },[]) 

  const renderItem =  ( item ) => {
    const itemID = item['item'].id
    const hasImage =  item['item'].hasImage
    return(   
     <> 

       <View style={styles.item}>
           { !items ?
           <>
               <ActivityIndicator style={styles.activityStyle} status='danger' />
           </>
           :
           <>
               <ItemImages collection={'Items'} itemId={itemID} hasImage={hasImage} />
           { hasImage ?
            <>
                <View style={{flexDirection:'column'}}>
                <Text style={styles.title}> {item['item'].itemName} {"\n"} </Text>
                <Text style={styles.subTitle}>
                    {item['item'].itemDescription} {"\n"} {"\n"}

                    Disponibles : {item['item'].cantidad} {"\n"}{"\n"} 
                <View style={{flexDirection:'row'}} >
                    <Button status='success' style={{width:'25%', height:'25%', resizeMode:'contain', left:0}} appearance='outline'  onPress={()=>{ BuyItem(item) }}>
                    <Text style={styles.innerText} >Agregar</Text>
                    </Button>
                    <View style={{marginLeft:20}} />
                    <Button status='success' style={{width:'25%', height:'25%', resizeMode:'contain', left:0}} appearance='outline'  onPress={()=>{ BuyItem2(item) }}>
                    <Text style={styles.innerText} >Retirar </Text>
                    </Button>
                </View>
                </Text>
                </View>
           </>
           :
           <>
            <View style={{flexDirection:'column'}}>
                <Text style={styles.title}> {item['item'].itemName} {"\n"} </Text>
                <Text style={styles.subTitle}>
                    {item['item'].itemDescription} {"\n"} {"\n"}
                    Disponibles : {item['item'].cantidad} {"\n"}{"\n"} 
                    <View style={{flexDirection:'row'}} >
                    <Button status='success' style={{width:'25%', height:'25%', resizeMode:'contain', left:0}} appearance='outline'  onPress={()=>{ BuyItem(item) }}>
                    <Text style={styles.innerText} >Agregar</Text>
                    </Button>
                    <View style={{marginLeft:20}} />
                    <Button status='success' style={{width:'25%', height:'25%', resizeMode:'contain', left:0}} appearance='outline'  onPress={()=>{ BuyItem2(item) }}>
                    <Text style={styles.innerText} >Retirar </Text>
                    </Button>
                </View>
                </Text>
            </View>
           </>
           }   
           </>
           } 
       </View>
     </>
     )
 }

  return (
    <>
        <View style={styles.container}>
            <View style={styles.box2} >
                { internetConnection ? 
                <>
                    { items &&
                    <>
                        <View style={{marginTop:10}} />
                        <FlatList data={items} renderItem={(item)=>renderItem(item)} keyExtractor={item => item.id} />
                    </>
                    }
                    <TouchableOpacity style={styles.button2} onPress={()=>{navigation.navigate('UploadItemScreen')} }>
                        <FontAwesome5 name={'plus'} size={20} color={'#ffffff'}/>
                    </TouchableOpacity>
                </>
                :
                <>  
                    <ActivityIndicator color="#4FAB1C"size="large" style={styles.activityIndicator}/>
                </>
                }
             </View>
        </View>
    </>

  )
}

export default InventarioScreen

const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:"#E6FFD4" 
    },
box2:{
    width:'90%',
    height:'90%',
    backgroundColor:'#ffffff',
    alignSelf:'center',
    marginTop:40,
    borderBottomColor: '#EAEAEA',
    borderTopColor:'#EAEAEA',
    borderLeftColor:'#EAEAEA',
    borderRightColor:'#EAEAEA',
    borderWidth:1
    },
    button2: {
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
    box:{
        marginTop: 30,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#CAC6C2",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        height:'90%',
        width:'90%',
        alignSelf:'center',
      },
      text:{
        color:'#ffffff  '
      },
      item: {
        backgroundColor: '#E6FFD4',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius:10,
        flexDirection:'row', 
        borderBottomColor: '#EAEAEA',
        borderTopColor:'#EAEAEA',
        borderLeftColor:'#EAEAEA',
        borderRightColor:'#EAEAEA',
        borderWidth:1
      },
      title: {
        fontSize: 18,
        marginLeft:'13%'
      },
      subTitle: {
        fontSize: 15,
        alignItems:'center',
        width:'50%'
      },
      subTitle_0: {
        fontSize: 15,
        alignItems:'center',
     
      },
      activityStyle:{
        size:"large",
        color:"#0000ff"
      },
      thrashStyle:{
        elevation:10,
        left:310,
        bottom:250,
        marginBottom:-22.4
      },
      text:{
        textAlign:'center'  
      },
      button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EDB16E',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10 ,
        right: 30, 
        elevation: 5,
      },
      evaButton:{
        width:'40%',
        height:'30%',
        resizeMode:'contain',
      },
      indicator: {
        justifyContent: 'center',
        alignItems: 'center',
      },
        innerText: {
        color: 'red'
      },
      titleAlternative: {
        fontSize: 18,
        alignSelf:'center',
        width:'100%',
        left:0,
        alignItems:'center',
        alignContent:'center', 

      },
      subTitleAlternative: {
        fontSize: 15,
        width:'70%',
        alignItems:'center',
      },
})