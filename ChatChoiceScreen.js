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

  useEffect(() => {
    socket.emit('register', username);
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez un type de chat</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PublicChat', { username,newMessage })}
      >
        <Text style={styles.buttonText}>Chat Public</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PrivateChat', { username,newMessage })}
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
