// AddUserButton.js
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, View, TextInput, Button } from 'react-native';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setUsername } from './redux';
import { useNavigation } from '@react-navigation/native';

const AddUserButton = () => {
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // État pour afficher ou masquer le formulaire
  const [localUsername, setLocalUsername] = useState('');
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const socketUrl = 'http://192.168.184.210:8080'; // Remplace par l'URL de ton serveur Socket.IO
  const navigation = useNavigation();

  useEffect(() => {
    // Créer une nouvelle connexion Socket.IO à l'adresse du serveur
    const socketConnection = io(socketUrl);
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connexion Socket.IO ouverte');
    });

    socketConnection.on('message', (data) => {
      console.log('Message reçu :', data);
    });

    socketConnection.on('disconnect', () => {
      console.log('Connexion Socket.IO fermée');
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Fonction pour afficher ou masquer le formulaire
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible); // Inverser l'état de visibilité
  };
  // Fonction pour envoyer un message privé à un destinataire spécifique
  const sendPrivateMessage = () => {
    if (socket) {
      // Envoyer un message de type 'private_message' au serveur avec le destinataire et le texte
      socket.emit('private_message', { to: recipient, text: message });
      setMessage(''); // Réinitialiser le champ du message après envoi
    }
  };
  // Fonction pour enregistrer l'utilisateur avec son identifiant (username)
  const registerUsername = () => {
    if (socket && username) {
      socket.emit('register', username);
      // dispatch(setUsername(localUsername)); // Met à jour le `username` dans Redux

      Alert.alert('Utilisateur enregistré', `Bienvenue, ${username}!`);
      setUsername(''); // Réinitialiser le champ de texte
      setIsFormVisible(false); // Masquer le formulaire après l'enregistrement
      navigation.navigate('Home', { userNme: username });
    } else {
      Alert.alert('Erreur', 'Veuillez entrer un identifiant');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleFormVisibility} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
        
      </TouchableOpacity>

      {/* Afficher le formulaire d'enregistrement si l'état isFormVisible est true */}
      {isFormVisible && (
        <View style={styles.form}>
      {/* Section pour enregistrer l'utilisateur */}
      <Text>Enregistrement de l'identifiant</Text>
      <TextInput placeholder="Identifiant" onChangeText={setUsername} value={username} />
      <Button title="S'enregistrer" onPress={registerUsername} />

      {/* <Text>Envoi de message privé</Text>
      <TextInput placeholder="Destinataire" onChangeText={setRecipient} value={recipient} />
      <TextInput placeholder="Message" onChangeText={setMessage} value={message} />
      <Button title="Envoyer" onPress={sendPrivateMessage} />

      <Text>Messages reçus:</Text>
      {chatMessages.map((msg, index) => (
        <Text key={index}>{`${msg.from}: ${msg.user}`} {`${msg.user}}`}</Text>
      ))}
      */}

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    padding: 5,
  },
});

export default AddUserButton;
