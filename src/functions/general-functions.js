import ImagePicker from 'react-native-image-crop-picker'
import NetInfo from "@react-native-community/netinfo"
import { Alert } from 'react-native'

import { uploadImageToStorage } from './firebase-storage-functions'
import { SaveInStorage } from '../storage/storage-functions';

export const CheckConnectivity = () => {
    return NetInfo.fetch().then((response) => {
      if(response.isConnected === true){
      //  console.log("Hay intenet !!")
      //  console.log("Connection type", response.type)
      //  console.log("Is connected?", response.isConnected)
      //  Alert.alert("Hay Internet !!")
        return true
  
      } else {
      //  console.log("No hay intenet !!")
     //   Alert.alert("No esta conectado a internet ...")
        return false
      }
    })
  } 

  export const lauchCameraOrLibrary = (isProfileImage="", setImages, update=null, setUpdate=null, userID)=>{
    Alert.alert( "Escoga una Opcion ", "¿Como quiere escoger la foto ?",[{text: "Cancelar", onPress: () => { return },
        },{text: "Seleccionar de la Bibloteca", onPress: () => { 
          ChooseProfilePick(isProfileImage, setImages, update, setUpdate, userID) },},
        { text: "Tomar Fotografia", onPress: () => {
          TakeProfilePick(isProfileImage, setImages, update, setUpdate) },
        },],{ cancelable: true })}


export const ChooseProfilePick = (isProfileImage="", setImages, update, setUpdate, userID) => {
  let multiplePictures = true
  let filename
    if(isProfileImage==="Profile") multiplePictures = false
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: false,
    multiple: multiplePictures
  }).then(images => {
    switch(isProfileImage){
      case "Profile":
        SaveInStorage('ProfilePicturePath', images.path)
        filename = images.path.substring(images.path.lastIndexOf('/') + 1)
        uploadImageToStorage(images.path, userID, filename, setUpdate, update)
        
      break
      case "NewItem":
          setImages(images)
      break
      default:
      break
    }
  })
}

export const TakeProfilePick = (isProfileImage, setImages, update, setUpdate) => {
  let multiplePictures = true
  let filename
    if(isProfileImage==="Profile") multiplePictures = false
    ImagePicker.openCamera({
      width: 300,          
      height: 400,          
      cropping: false,      
      multiple:multiplePictures,
    }).then(image => {
    switch(isProfileImage){
      case "Profile":
        SaveInStorage('ProfilePicturePath', image.path)
        filename = image.path.substring(image.path.lastIndexOf('/') + 1)
        uploadImageToStorage(image.path, userID, filename,setUpdate, update)
       
      break
      case "NewItem":
        let imagesArray=[]
            imagesArray.push(image) 
            setImages(imagesArray)
      break
      default:
      break
    }
  })
}

export const SetCurrentUserSpecificInfo = () =>{
    auth().onAuthStateChanged((user) => {
      if(user){
        SaveInStorage('id', user.uid)
        SaveInStorage('userCompleteName', user.displayName)
        SaveInStorage('email', user.email)
    }})
}