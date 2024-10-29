
// WebSocketExample.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import io from 'socket.io-client'; // Importer le client Socket.IO

const WebSocketExample = () => {
  // États pour stocker la connexion Socket.IO, l'identifiant de l'utilisateur, 
  // le message, le destinataire, et les messages reçus
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const socketUrl = 'http://192.168.184.210:8080'; // Remplace par l'URL de ton serveur Socket.IO

  useEffect(() => {
    // Créer une nouvelle connexion Socket.IO à l'adresse du serveur
    const socketConnection = io(socketUrl);
    setSocket(socketConnection); // Enregistrer la connexion Socket.IO dans l'état

    // Event listener pour l'ouverture de la connexion
    socketConnection.on('connect', () => {
      console.log('Connexion Socket.IO ouverte');
    });

    // Event listener pour les messages reçus via la connexion Socket.IO
    socketConnection.on('message', (data) => {
      // Ajouter le message reçu à la liste des messages dans l'état
      setChatMessages(prevMessages => [...prevMessages, data]);
    });

    // Event listener pour la fermeture de la connexion Socket.IO
    socketConnection.on('disconnect', () => {
      console.log('Connexion Socket.IO fermée');
    });

    // Nettoyage: fermeture de la connexion Socket.IO lorsque le composant se démonte
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Fonction pour enregistrer l'utilisateur avec son identifiant (username)
  const registerUsername = () => {
    if (socket) {
      // Envoyer un message de type 'register' au serveur avec l'identifiant de l'utilisateur
      socket.emit('register', username);
    }
  };

  // Fonction pour envoyer un message privé à un destinataire spécifique
  const sendPrivateMessage = () => {
    if (socket) {
      // Envoyer un message de type 'private_message' au serveur avec le destinataire et le texte
      socket.emit('private_message', { to: recipient, text: message,currentUser:username });
      setMessage(''); // Réinitialiser le champ du message après envoi
    }
  };

  return (
    <View>
      {/* Section pour enregistrer l'utilisateur */}
      <Text>Enregistrement de l'identifiant</Text>
      <TextInput placeholder="Identifiant" onChangeText={setUsername} value={username} />
      <Button title="S'enregistrer" onPress={registerUsername} />

      {/* Section pour envoyer un message privé */}
      <Text>Envoi de message privé</Text>
      <TextInput placeholder="Destinataire" onChangeText={setRecipient} value={recipient} />
      <TextInput placeholder="Message" onChangeText={setMessage} value={message} />
      <Button title="Envoyer" onPress={sendPrivateMessage} />

      {/* Affichage des messages reçus */}
      <Text>Messages reçus:</Text>
      {chatMessages.map((msg, index) => (
        <Text key={index}>{`${msg.from}: ${msg.user}`} {`${msg.user}}`}</Text>
      ))}
    </View>
  );
};

export default WebSocketExample;
