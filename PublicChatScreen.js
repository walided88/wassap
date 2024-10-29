import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { showNotification } from './Notification'; // Importation de la fonction
import { useSelector, useDispatch } from 'react-redux';




const PublicChatScreen = ({ route }) => {
  const navigation = useNavigation();
  // État pour stocker les messages du chat
  const [messages, setMessages] = useState([]);
  // État pour stocker le texte du message en cours de saisie
  const [input, setInput] = useState('');
  // URL du serveur socket
  const socketUrl = 'http://192.168.11.210:8080';
  // Référence pour la connexion socket
  const socketRef = useRef();
  // Récupération du nom d'utilisateur depuis les paramètres de la route
  const { username } = route.params;
  // Référence pour la liste de messages afin de pouvoir faire défiler jusqu'au bas
  const flatListRef = useRef(null);
  // Référence pour l'entrée de texte afin de la focus automatiquement
  const inputRef = useRef(null);
  // État pour suivre la direction de défilement (haut/bas)
  const [scrollDirection, setScrollDirection] = useState('');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  // Clé secrète partagée pour le chiffrement
  const secretKey = 'xxxxxxxxx';
  const myBoolean = useSelector((state) => state.boolean.value);
  const newMessage = useSelector((state) => state.string.value);
  // console.log(myBoolean,' est le statut actuel et newMessage est : ',newMessage);
  const newMessageRef = useRef(newMessage);


  useEffect(() => {
    // Focus automatique sur le champ de saisie lors du chargement du composant
    inputRef.current?.focus();
    // Fonction pour récupérer les messages publics depuis l'API
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://192.168.11.210:8080/publicMessages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
      }
    };

    // Appel de la fonction pour récupérer les messages
    fetchMessages();


    // Connexion au serveur socket
    socketRef.current = io(socketUrl);
    // Écoute des nouveaux messages et mise à jour de l'état des messages
    socketRef.current.on('public_message', (data) => {

      setMessages((prevMessages) => [...prevMessages, data]);
      // Exemple d'utilisation
      // showNotification('Nouveau message', 'Vous avez reçu un nouveau message !');


    });
    // socketRef.current.on('is_offline', (data) => {
  
    //   if (newMessageRef.current === 'false') {
    //     showNotification(`Nouveau Message de : ${data.from}`, data.text);
    //     dispatch(setString("false")); // Assuming `setString` will update it to a non-triggering value

    //   }
    
    // });
  
    // Déconnexion du socket lorsque le composant est démonté
    return () => {
    };
  }, [socketUrl]);

  useEffect(() => {
    // Défilement automatique vers le bas chaque fois que de nouveaux messages sont reçus
    flatListRef.current?.scrollToEnd({ animated: true });
    // console.log("  // Défilement automatique vers le bas chaque fois que de nouveaux messages sont reçus");

  }, [messages]);

  // Réinitialiser la direction de défilement après un court délai
  useEffect(() => {
    if(scrollDirection === 'down')
      setTimeout(() => setScrollDirection("up"), 3000);
    // console.log("Réinitialiser la direction de défilement après un court délai");

  }, [scrollDirection]);

  // Fonction pour envoyer un message public
  const sendPublicMessage = () => {
    setScrollDirection('up');
    setButtonClicked(true);
    // console.log(" Fonction pour envoyer un message public");
    if (input.trim()) {
      // Émission du message via le socket
      socketRef.current.emit('public_message', { from: username, text: input });
      // Réinitialisation de l'input après l'envoi
      setInput('');

    }
  };

  // Fonction de rendu de chaque message dans la liste
  const renderItem = ({ item }) => (
    <View style={item.from === username ? styles.myMessageContainer : styles.otherMessageContainer}>
      <Text style={styles.messageText}>{item.from}: {item.text}</Text>
    </View>
  );




  // Gestion du défilement pour déterminer la direction (haut ou bas)
  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if ((currentScrollY > lastScrollY) && !buttonClicked) {
      setScrollDirection('down');
      setTimeout(() => setScrollDirection("up"), 3000);

    } else  if ((currentScrollY < lastScrollY) ){
      setScrollDirection('up');
      setButtonClicked(false);

    }
    console.log("Gestion du défilement pour déterminer la direction (haut ou bas)");

    setLastScrollY(currentScrollY);
  };

  // Défilement manuel vers le bas de la liste
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setScrollDirection("up");
    console.log("Défilement manuel vers le bas de la liste");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ImageBackground
        source={require("./images/image.jpg")}
        style={styles.imageBackground}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          onScroll={handleScroll}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messagesList}
        />
        {/* Bouton pour descendre lorsqu'il y a un défilement vers le bas */}
        {scrollDirection === 'down' && (
          <TouchableOpacity style={styles.scrollButton2} onPress={handleScrollToEnd}>
            <Text style={styles.scrollButtonText}>Descendre</Text>
          </TouchableOpacity>
        )}
        <View style={styles.footer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Écrire un message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendPublicMessage}>
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  myMessageContainer: {
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    maxWidth: '75%',
  },
  otherMessageContainer: {
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-start',
    maxWidth: '75%',
  },
  messageText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    padding: 10,
    elevation: 1,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollButton2: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 10,
  },
  scrollButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PublicChatScreen;

