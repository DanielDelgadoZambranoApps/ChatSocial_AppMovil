import React, { useState, useEffect } from "react";
import { SafeAreaView, ActivityIndicator, View, StyleSheet, Image} from "react-native";

import { IsLogin } from  '../functions/firebase-auth-functions'

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true)
  const [user, setUser] = useState(null)

   useEffect(() => {
    IsLogin(setUser)
  }, [])  


  useEffect(() => {
    setTimeout(() => {
      setAnimating(false)
      if(user){
        navigation.replace("DrawerNavigator") 
      }else{
        navigation.replace("LoginScreen")
      }
    }, 3000);
  }, [user])  

  return (
    <SafeAreaView style={styles.stylesheet}>
      <View style={styles.container}>
        <Image source={require("../../assets/CCU.png")} style={styles.image} />
        <ActivityIndicator animating={animating} color="#4FAB1C"size="large" style={styles.activityIndicator}/>
      </View>
    </SafeAreaView>
  )}

export default SplashScreen;

const styles = StyleSheet.create({
  stylesheet:{
    flex:1,
    backgroundColor:'#DDFDC6'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
  image:{
    width: "90%",
    resizeMode: "contain",
    margin: 30,
  }
})