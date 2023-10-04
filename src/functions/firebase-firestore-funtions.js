import { Alert } from "react-native"

import { CheckConnectivity } from '../functions/general-functions'
import {DeleteEventPictures} from '../functions/firebase-storage-functions'

import firestore from '@react-native-firebase/firestore'; 
import storage from '@react-native-firebase/storage'

export const createUserIniatialDataInFirebase = (user, userName) => {
    firestore().collection('Usuarios').doc(user['user'].uid).set({
      userMail:user['user'].email ,
      userCompleteName : userName ,
      userID: user['user'].uid,
    })
    .then((value) => {
      console.log("Registro en Users Collection realizado satisfactoriamente !")
    }) 
  }

export const GetAllUserData = async (collection, userDocID, setData)=>{
  const userInfo =  await firestore().collection(collection).doc(userDocID).get()
  if(userInfo) if(userInfo._data)setData(userInfo._data) 
}


export const GetCollection = async (collection, setData) =>{
  if(CheckConnectivity()){
    console.log(collection  + " sacado desde Firebase")
    const subscriber = firestore().collection(collection).onSnapshot(
      (querySnapshot) => {
        let temp = []
        querySnapshot.forEach((documentSnapshot) => {
          let userDetails = {};
          userDetails = documentSnapshot.data();
          userDetails['id'] = documentSnapshot.id;
          temp.push(userDetails);
        })
        setData(temp);
      },
      (error) => {
        console.log('error', error);
      })
      return () => subscriber()  
      }
    else {
      Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
    }
}

export const GetLatestCollectionsData = (roomID, setSuperData) =>{  
  const subscriber = firestore().collection(roomID).orderBy('date','desc').onSnapshot(
    (querySnapshot) => {
      let temp = []
      querySnapshot.forEach((documentSnapshot) => {
        let userDetails 
        userDetails = documentSnapshot.data();
        temp.push(userDetails);
      }) 
      setSuperData(temp)
    },
    (error) => {
      console.log('error', error);
    })
    return () => subscriber()  
}

export const uploadGroup = async (userID, groupName, group, navigation) => {
  const userInfo = await firestore().collection('Usuarios').doc(userID).get()
  let empty = true
  let previusGroups = []

      if(userInfo){
        if(userInfo._data){
          if(userInfo._data.userGroups){
            previusGroups = userInfo._data.userGroups
            empty=false
          } 
        }
      }
      previusGroups.push({id:groupName, value:group})

        firestore().collection('Usuarios').doc(userID)
        .update({
          userGroups:previusGroups
        }).then(() => {
          Alert.alert("Grupo creado con exito", "Ahora puede enviar mensajes a todos los integrantes de este grupo.",
          [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false }) 
          navigation.navigate('DrawerNavigator') 
        }) 
  
}


export const getSpecificDoc = async (userID, setContactsGroup) => {
  let data
  const userInfo = await firestore().collection('Usuarios').doc(userID).get()

  if(userInfo){
    if(userInfo._data){
      if(userInfo._data['userGroups']){
        data = userInfo._data['userGroups']
        setContactsGroup(userInfo._data['userGroups'])
        for (const subitem of data){
       //    console.log("super item --------------> " + JSON.stringify(subitem['value']) )
        }
      }
    }
  }
}

export const UploadItem = (itemName, itemDescription, images=null, credits, amount, userName, userMail, userID) => {
  let hasImage = false
  let filnename
  if(CheckConnectivity()) {
    if(images)  hasImage=true
    firestore().collection('Items').add({
      itemName: itemName.replace(/['"]+/g, ''),
      itemDescription:itemDescription.replace(/['"]+/g, ''),
      credits:Number(credits),
      userName:userName,
      userMail:userMail,
      userID:userID,
      hasImage:hasImage,
      cantidad:amount
    }).then((value) => {
      firestore().collection('Items').doc(value.id).update({
        itemID:value.id
      }).then((value) => {})

      if(images){
        for(const item of images){
          filnename = item.path.substring(item.path.lastIndexOf('/') + 1)
          uploadImageToStorage2(item.path, value.id, 'Items', filnename) 
        } 
      } Alert.alert("Exito", "Se agrego el articulo en el inventario",
      [{ text: "Continuar", onPress: () => { return null}},],
      { cancelable: false })
    })} else {
      Alert.alert("No hay Conexion ...", "",
      [{ text: "Continuar", onPress: () => { return null}},],
      { cancelable: false })
    }
  }

  export function uploadImageToStorage  ( pathMain, id, collectionName="", imageName ) {
    let reference
    reference = storage().ref(collectionName + "/" + id + "/" + 'UserPic'); // linea de los dioses
    let task =  reference.putFile( pathMain );
    console.log(" 1arrastando ----------------> " + pathMain )
    console.log(" 2arrastando ----------------> " + collectionName + "/" + id + "/" + imageName )
     task.then(() => {
        console.log('Image uploaded to the bucket!');
    }).catch((e) => {
        console.log('uploading image error => ', e)
    })
  }

  
  export function uploadImageToStorage2  ( pathMain, id, collectionName="", imageName ) {
    let reference
    reference = storage().ref(collectionName + "/" + id + "/" + imageName); // linea de los dioses
    let task =  reference.putFile( pathMain );
    console.log(" 1arrastando ----------------> " + pathMain )
    console.log(" 2arrastando ----------------> " + collectionName + "/" + id + "/" + imageName )
     task.then(() => {
        console.log('Image uploaded to the bucket!');
    }).catch((e) => {
        console.log('uploading image error => ', e)
    })
  }


  export const BuyItem = async (item ) => {

    const itemInfo =  await firestore().collection('Items').doc(item['item'].id).get()
    let currentAmount = null

    Alert.alert("Unidad agregada", "",
    [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

    if(itemInfo){
      if(itemInfo._data){
        if(itemInfo._data.cantidad){
          currentAmount= itemInfo._data.cantidad
          currentAmount = currentAmount + 1

          firestore().collection('Items').doc(item['item'].id)
          .update({
            cantidad: currentAmount 
          }).then(() => {
            console.log("unidad agregada !!")
           }) 
        }
      }
    }
  }


  export const BuyItem2 = async (item ) => {

    const itemInfo =  await firestore().collection('Items').doc(item['item'].id).get()
    let currentAmount = null

    Alert.alert("Unidad retirada", "",
    [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

    console.log("estado -------> " +JSON.stringify(itemInfo._data.cantidad) )

    if(itemInfo){
      if(itemInfo._data){
        if(itemInfo._data.cantidad){
          currentAmount= itemInfo._data.cantidad
          currentAmount = currentAmount - 1
          if(currentAmount < 1){
            await firestore().collection('Items').doc(item['item'].id).delete().then(()=>{console.log("Item eliminado porque no quedan unidades")})
            DeleteEventPictures("", item['item'].id)
          } else {
            firestore().collection('Items').doc(item['item'].id)
            .update({ cantidad: currentAmount }).then(() => {console.log("unidad agregada !!")}) 
          }
        }
      }
    } 
  }


  export const sendToAllContacts = async (users, message, myid, userCompleteName,setSelectedGroupsArray, setMessage, setUpdate,update, navigation) => {
    let contactsArrayLocal = []

    for (const item of users){
      let aux
      let flag = true
      if(item){
        if(item['value']){
          aux=item['value']
          for (const subitem of aux ){
            flag = true
            for(const subitem2 of contactsArrayLocal){
              if(subitem2 === subitem){
                flag=false
              }
            }
            if(flag){
              contactsArrayLocal.push(subitem)
            }
          }
        }
      }
    }

    if(contactsArrayLocal){

      for(const idcontact of contactsArrayLocal){
        kaiser(idcontact, message, myid, userCompleteName)
      }
      Alert.alert("Mensaje Enviado ", "El mensaje se envio a todos los los grupos seleccionados !",
        [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
        setSelectedGroupsArray(null) 
        setMessage('')
        setUpdate(!update)
        navigation.navigate('Chats')
    } 





  }


  const kaiser = async (contactid, message, myid, userCompleteName)=>{

    let chatUrl = contactid  + myid
    let messages 
    if(contactid  > myid) chatUrl = myid + contactid 


    firestore().collection(chatUrl).orderBy('date','desc').onSnapshot(
      (querySnapshot) => {
        let temp = []
        querySnapshot.forEach((documentSnapshot) => {
          let userDetails 
          userDetails = documentSnapshot.data();
          temp.push(userDetails);
        }) 

        messages= temp
      },
      (error) => {
        console.log('error', error);
      })




  let url = await storage().ref('Usuarios' + '/'+myid+'/' + 'ProfilePic').getDownloadURL().catch((e) => {
    console.log("no hay picture from the user")
  })
  if(!url){
   url="https://firebasestorage.googleapis.com/v0/b/messagesccu.appspot.com/o/Usuarios%2FnoPicture%2FNoPicture.png?alt=media&token=e1a369d5-5167-4295-9c5d-0c75b1b52e03"
  }    
 let   newUser= {    
   _id: myid,
   name: userCompleteName,
   avatar: url
 }
 firestore()
 .collection(chatUrl)
 .add({
   _id: messages.length + 1, 
   text: message,
   createdAt: JSON.stringify(new Date()).replace(/['"]+/g, '') , 
   date:new Date() ,
   user:newUser ,
 })
 .then(() => {
   console.log("Mensaje Enviado!")
 })

  }


  