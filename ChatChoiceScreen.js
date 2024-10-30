// ChatChoiceScreen.js
import React, { useEffect, useState,useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setString, toggleBoolean,setNotification } from './store';  // Importe les actions
import { showNotification } from './Notification'; // Importation de la fonction
import io from 'socket.io-client';

const ChatChoiceScreen = () => {
  const route = useRoute();
  const socketUrl = 'https://wassap.onrender.com';
  const socket = io(socketUrl);
  const navigation = useNavigation();
  const { username } = route.params; // Récupérer le nom d'utilisateur
  const myBoolean = useSelector((state) => state.boolean.value);
  const newMessage = useSelector((state) => state.string.value);
  const dispatch = useDispatch();
  const newMessageRef = useRef(newMessage);

  // if(newMessage=='xx' ) showNotification('Nouveau message', 'Vous avez reçu un nouveau message !');
  useEffect(() => {
    newMessageRef.current = newMessage;
  }, [newMessage,username]);
  useEffect(() => {

    socket.emit('register', username);
    
  
    socket.on('is_offline', (data) => {
  
      if (newMessageRef.current === 'false') {
        showNotification(`Nouveau Message de : ${data.from}`, data.text);
        dispatch(setString("false")); // Assuming `setString` will update it to a non-triggering value
        dispatch(setNotification(data.text)); // Assuming `setString` will update it to a non-triggering value

      }
    
    });
  
  
    return () => {

      socket.disconnect();
    };

    
  }, [username,newMessage]);


  // console.log(myBoolean," ChatChoiceScreen: est statut contact et newMessage ",prop);
  // if(newMessage=='xx' ) showNotification('Nouveau message', 'Vous avez reçu un nouveau message !');
   

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez un type de chat</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PublicChat', { username,newMessageRef })}
      >
        <Text style={styles.buttonText}>Chat Public</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PrivateChat', { username,newMessageRef })}
      >
        <Text style={styles.buttonText}>Chat Privé</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e5ddd5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#25D366',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatChoiceScreen;
