import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, ImageBackground, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setString, toggleBoolean, setNotification,setSizes } from './store';
import { showNotification } from './Notification'; // Importation de la fonction

const PrivateChatComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser, selectedUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [roomId, setRoomID] = useState('');
  const [size, setSize] = useState(0);
  const [users, setUsers] = useState([]);

  const socketUrl = 'https://wassap.onrender.com';
  const socketRef = useRef(null);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const socket = io(socketUrl);

  const myBoolean = useSelector((state) => state.boolean.value);
  const newMessage = useSelector((state) => state.string.value);
  const theSize = useSelector((state) => state.size.value);
  const theSizeRef = useRef(theSize);


  // console.log(`ddddddddd PrivateChatScreen theSizetheSize   ${theSizeRef.current}`);


  useEffect(() => {
    const updateContactStatus = async (action) => {
      const url = `https://wassap.onrender.com/onlinWith`;
      try {
        await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentUser, selectedUser: action === 'leave' ? "void" : selectedUser })
        });
      } catch (error) {
        alert(error.message);
      }
    };
  
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://wassap.onrender.com/privetMessages');
        const data = await response.json();
        const filteredMessages = data.filter(
          msg => (msg.from === currentUser && msg.to === selectedUser) ||
                 (msg.from === selectedUser && msg.to === currentUser)
        );
        setMessages(filteredMessages);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMessages();
  
    socketRef.current = io(socketUrl);
    socketRef.current .emit('register', currentUser);
    socket.on('update_users', (userList) => {
      setUsers(userList);
    });
  
    socketRef.current.on('send_pvMessage', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
  
    });
   
  socketRef.current.on('send_notification', (data) => {

      showNotification(`Nouveau message de: ${data.from}`, data.text);
    
  });
    return () => {
      
      dispatch(setString('false'));
      updateContactStatus('leave');
      dispatch(setNotification(''));
      
      // Emission de l'événement leaveRoom
      socketRef.current.emit('leaveRoom',  currentUser, selectedUser );
      
  
    };
  
  }, [socketUrl, currentUser, selectedUser]);
  
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);



  useEffect(() => {
    console.log(`PrivateChatComponent sizesizesize ${size}`);


      socketRef.current.emit('joinRoom', currentUser, selectedUser);
  
  }, []);
  const handleSendMessage = () => {
    
    if (input.trim()) {
      const messageData = { text: input, to: selectedUser, from: currentUser };

      socketRef.current.emit('send_private_message', messageData);
      setInput('');
    }
  };

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
    setLastScrollY(currentScrollY);
    if (currentScrollY < lastScrollY) setButtonClicked(false);
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.from === currentUser ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>
        {item.from !== currentUser && <Text style={styles.sender}>{item.from}: </Text>}
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ImageBackground source={require("./images/image.jpg")} style={styles.imageBackground}>
        {scrollDirection === 'down' && (
          <TouchableOpacity style={styles.scrollButton} onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}>
            <Text style={styles.scrollButtonText}>Descendre</Text>
          </TouchableOpacity>
        )}
        {isLoading && <LoadingSpinner />}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Écrire un message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const LoadingSpinner = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#25D366" />
    <Text style={styles.loadingText}>Chargement...</Text>
  </View>
);

const styles = StyleSheet.create({
  imageBackground: { flex: 1, justifyContent: "center" },
  container: { flex: 1, padding: 16, backgroundColor: '#e5ddd5' },
  messageContainer: { marginVertical: 5, padding: 10, borderRadius: 20, maxWidth: '80%' },
  sentMessage: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6' },
  receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  messageText: { fontSize: 16 },
  sender: { fontWeight: 'bold', color: '#007bff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  input: { flex: 1, padding: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', marginRight: 10 },
  sendButton: { backgroundColor: '#25D366', padding: 10, borderRadius: 20 },
  sendButtonText: { color: 'white' },
  scrollButton: { backgroundColor: 'blue', padding: 10, borderRadius: 20 },
  scrollButtonText: { color: 'white' },
});

export default PrivateChatComponent;