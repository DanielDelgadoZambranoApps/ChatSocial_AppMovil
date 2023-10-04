import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const MyButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={props.customClick}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#52B11E',
    color: '#ffffff',
    width:'80%',
    height: '5.5%',
    marginVertical: 10,
    borderRadius:10,
    alignSelf:'center',
    top:'3%'  
  },
  text: {
    color: '#ffffff',
    fontSize:16,
    top:'17%'
  },
})

export default MyButton;