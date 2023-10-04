import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { CheckConnectivity, lauchCameraOrLibrary} from '../functions/general-functions'
import { getFullStorageItemPath } from '../functions/firebase-storage-functions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'

import ProfileButton from '../components/ProfileButton'

const ProfileScreen = ({ navigation }) => {
    const [userCompleteName, setUserCompleteName] = useState('Cargando Nombre ...')
    const [profilePicUrl, setProfilePicUrl] =useState(null)
    const [userEmail, setUserEmail] = useState('Cargando Mail')
    const [loading, setLoading] = useState(true)
    const [imageUrl, setImageUrl] = useState(null)
    const [update, setUpdate] = useState(false)
 
    const [userID, setUserID] = useState(null)

    useEffect(()=>{
        getFullStorageItemPath(userID, setProfilePicUrl, setLoading) 
       },[userID, update])

    useEffect(()=>{
        GetSpecificValueFromAsyncStorage('ProfilePicturePath', setImageUrl)
        if(CheckConnectivity()){
            GetCurrentSpecificInfo("userCompleteName", setUserCompleteName)
            GetCurrentSpecificInfo("email", setUserEmail)
            GetCurrentSpecificInfo('id', setUserID)
        } else {
            GetSpecificValueFromAsyncStorage('userCompleteName', setUserCompleteName)
            GetSpecificValueFromAsyncStorage('email', setUserEmail)
            GetSpecificValueFromAsyncStorage('id', setUserID)
        }
    },[update]) 

    return( 
        <View style={styles.container} >
            <View style={styles.box} > 

            { loading ?
            <>
                <ActivityIndicator color="#4FAB1C"size="large" style={styles.activityIndicator}/>
            </>
            :
            <>
                { profilePicUrl ?
                    <>
                        <Image source={{uri:profilePicUrl}} style={styles.userImg} />
                    </>
                    :
                    <>
                        <Image source={require("../../assets/ProfilePic.png")} style={styles.userImg} />
                    </>
                }
            </>
            }
            <Text style={styles.text}> {userCompleteName} </Text>
            <Text style={styles.credits}> Correo : {userEmail} </Text>
            { !loading &&
                        <TouchableOpacity
                        style={styles.plusButton}
                        onPress={()=>lauchCameraOrLibrary("Profile", null, update, setUpdate, userID) }>
                            <FontAwesome5
                                name={'plus'}
                                size={20}
                                color={'#ffffff'}/>
                        </TouchableOpacity>
            }
                <View style={{marginTop:'50%'}} />
                <ProfileButton title='Cerrar Sesion' navigation={navigation} nextScreen='Cerrar Sesion' />
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff"
    },
    text:{
        fontSize:20,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        marginTop:90,
        marginBottom:20
    },
    credits:{
        fontSize:16,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'flex-start',
        marginTop:10,
        marginLeft:40
    },
    email:{
        fontSize:14,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        marginTop:20
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
        alignSelf:'center',
        marginTop:30,
    },
    box:{
        marginTop: 30,
        paddingVertical: 8,
        borderWidth: 0,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#D5F3BF",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        height:'90%',
        width:'90%',
        alignSelf:'center'
      },
      plusButton: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#4FAB1C',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 410,
        right: 115,
        elevation: 5,
    },
    activityIndicator: {
        alignItems: "center",
        height: 80,
      },
})
