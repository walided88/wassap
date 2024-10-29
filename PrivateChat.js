// PrivateChat.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';

const PrivateChat = ({ route }) => {
  const { username, selectedUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketUrl = 'http://192.168.11.210:8080'; // Remplace par l'URL de ton serveur Socket.IO
  const socket = io(socketUrl);
  const isDarkMode = useSelector((state) => state.isDarkMode); // Get the current mode from the Redux store
  const dispatch = useDispatch(); // Get the dispatch function
  useEffect(() => {
    // Écouter les messages privés
    socket.on('private_message', (data) => {
      if (data.from === selectedUser || data.to === selectedUser) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    // Nettoyage à la déconnexion
    return () => {
      socket.disconnect();
    };
  }, [selectedUser]);

  const sendPrivateMessage = () => {
    if (input.trim()) {
      socket.emit('send_private_message', { text: input, to: selectedUser, from: username });
      setInput('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.from}: {item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.chatHeader}>Chat avec {selectedUser}</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <TextInput
        style={styles.input}
        placeholder="Écrire un message..."
        value={input}
        onChangeText={setInput}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendPrivateMessage}>
        <Text style={styles.sendButtonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#e5ddd5',
  },
  chatHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#25D366',
    padding: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PrivateChat;
