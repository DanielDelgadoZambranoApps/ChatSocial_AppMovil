import storage from '@react-native-firebase/storage'
import { CheckConnectivity } from '../functions/general-functions'

export function uploadImageToStorage  (pathMain, userID,filename, setUpdate, update ) {
    let reference
    reference = storage().ref('Usuarios' + "/" + userID + "/" + 'ProfilePic'); // linea de los dioses
    let task =  reference.putFile( pathMain );
     task.then(() => {
        console.log('Image uploaded to the bucket!');
        setUpdate(!update)

    }).catch((e) => {
        console.log('uploading image error => ', e)
    })
}

export const getFullStorageItemPath = async (userID, setProfilePicUrl, setLoading) => {
    const url = await storage().ref('Usuarios' + '/' + userID + "/" + 'ProfilePic').getDownloadURL().catch((e) => {
       //  console.error(e);
        console.log("no hay picture from the user")
        if (setLoading) setLoading(false)
     //   if(url)setProfilePicUrl(url)
      })
      if(url){
        setProfilePicUrl(url)
      }    
      if (setLoading) setLoading(false)
  }

  
  export const listFilesAndDirectoriesGeneric = async (pageToken, collection="", id="", setListData) => {
    if(CheckConnectivity()){
      const reference = storage().ref(collection + '/' + id );
      await reference.list({ pageToken }).then((result) => {
        result.items.forEach((ref) => {
        })
        if (result.nextPageToken) {
          return listFilesAndDirectories(
            reference,
            result.nextPageToken
          );
        }
        setListData(result.items)
      });
    } else {
      Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
    }
  }

  export const getFullStorageItemPath3 = async (collection='', itemID, fileName, imagesUrlsArray, setIsLoading) => {
    const url = await storage().ref(collection + '/' + itemID + "/" + fileName).getDownloadURL().catch((e) => {
        console.error(e);
      })
      imagesUrlsArray.push({url:url})
      if(setIsLoading){
        setIsLoading(false)
      } 
  }

  
export const DeleteEventPictures  =async (pageToken="", id)=>{
    const reference = storage().ref('Items' + '/' + id )
      await reference.list({ pageToken }).then((result) => {
        result.items.forEach((ref) => {
        ref.delete()
         console.log('Eliminado de Firebase Storage exitosamente ') 
        })    
      }
    )
  }
  
