import React, { useEffect, useState,useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList,TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setString, toggleBoolean,setNotification ,setSizes} from './store';  // Importe les actions
import { showNotification } from './Notification'; // Importation de la fonction
import Notification from './Notification';

const PrivateChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { username,newMessage } = route.params;
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [userInfo, setUserInfo] = useState('');
  const usernameRef = useRef(username); // Utilisation de useRef pour stocker le username
  const [isClicked, setIsClicked] = useState(false);
  const [contactName, setContactName] = useState('');
  const dispatch = useDispatch();
 const socketUrl = 'https://wassap.onrender.com';
  const socket = io(socketUrl);
  const socketRef = useRef(null);



  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`https://wassap.onrender.com/${usernameRef.current}`); // Utilise usernameRef.current
      if (!response.ok) {
        throw new Error('Utilisateur non trouvé ou erreur lors de la requête');
      }
      const data = await response.json(); // Récupération des données de l'utilisateur
      setUserInfo(data); // Mise à jour des informations utilisateur
    } catch (err) {
      setUserInfo(null); // Réinitialise les informations si une erreur survient
    }
  };

  // Utilisation de useEffect pour appeler fetchUserInfo une seule fois lors du premier rendu
  useEffect(() => {
    fetchUserInfo();

  }, []); // Le tableau vide [] garantit que l'effet est exécuté une seule fois au montage


  const switchClicked = () => {  
    
    setIsClicked(!isClicked);
  }
  useEffect(() => {
   
    socketRef.current = io(socketUrl);

    socketRef.current.emit('register', username);

    socketRef.current.on('update_users', (userList) => {
      setUsers(userList);
    });
    socketRef.current.on('send_pvMessage', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
  
    });
    socketRef.current.on('send_notification', (data) => {
     
        showNotification(`Nouveau message de: ${data.from}`, data.text);
   
    });
    const theUser=users.find(el=>el.username==username)
    setUser(theUser);
  
    return () => {

    };

    
  }, [username,user]);





  const handleAddContact = async () => {

    // Vérifie si les champs username et password ne sont pas vides
    if (!contactName.trim()) {
      alert('Veuillez indiquer un utilisateur.'); // Alerte si les champs sont vides
      return;
    }
  
    // Détermine l'URL de la requête en fonction du mode (inscription ou connexion)
    const url =`https://wassap.onrender.com/addContact` // URL pour l'inscription
     
    try {
      // Envoie une requête POST au serveur pour l'inscription ou la connexion
      const response = await fetch(url, {
        method: 'PUT', // Méthode HTTP utilisée pour la requête
        headers: {
          'Content-Type': 'application/json', // Indique que le corps de la requête est au format JSON
        },
        body: JSON.stringify({ contactName,username}), // Corps de la requête contenant les données d'authentification
      });

      fetchUserInfo();

      // Vérifie si la réponse du serveur n'est pas correcte
      if (!response.ok) {
        const data = await response.json(); // Récupère le message d'erreur en cas de réponse non valide
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

    } catch (error) {

      alert(error.message); // Affiche un message d'erreur à l'utilisateur
    }
    setContactName("");
  };
  const handleUserSelect = (user,statut) => {

    dispatch(setString('true'));

    navigation.navigate('PrivateChatComponent', {
      currentUser: username,
      selectedUser: user,
      isOnline: statut,
    });

      socket.disconnect();

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={switchClicked} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bonjour {userInfo.username}</Text>
      </View>

      {isClicked && (
        <TextInput
          style={styles.input}
          placeholder="Ajouter un Contact"
          value={contactName}
          onChangeText={setContactName}
        />
      )}
      {isClicked && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.contactListTitle}>Liste des contacts :</Text>

      <FlatList
        data={userInfo.contacts}
        renderItem={({ item }) => {
          const isOnline = users.some((el) => el === item.contactName);

          return (
            <TouchableOpacity onPress={() => handleUserSelect(item.contactName,isOnline)} style={styles.contactButton}>
                <Text
                  style={[
                    styles.contactButtonText,
                    isOnline ? styles.onlineText : styles.offlineText,
                  ]}
                >
                  {item.contactName +
                    (isOnline ? " est en ligne" : " est hors ligne")}
                </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.contactName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0', // Couleur de fond proche de WhatsApp
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075E54', // Couleur du texte utilisée par WhatsApp
  },
  contactListTitle: {
    fontSize: 16,
    color: '#128C7E',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#25D366', // Vert WhatsApp pour les boutons principaux
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Effet de surélévation (ombre) des boutons
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // Légère ombre pour simuler des cartes d'interaction
  },
  contactButtonText: {
    fontSize: 16,
    color: '#075E54', // Couleur de texte pour les noms de contacts
  },
  onlineText: {
    color: '#25D366', // Vert pour les utilisateurs en ligne
    fontWeight: 'bold',
  },
  offlineText: {
    color: '#999999', // Gris pour les utilisateurs hors ligne
    fontStyle: 'italic',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});


export default PrivateChatScreen;