// HomeScreen.js
import React, { useState } from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setString, toggleBoolean } from './store';  // Importe les actions
import { showNotification } from './Notification'; // Importation de la fonction

const HomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false); // État pour basculer entre login et signup
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const myBoolean = useSelector((state) => state.boolean.value);
  const newMessage = useSelector((state) => state.string.value);

  

  // if(newMessage=='xx') showNotification('Nouveau message', 'Vous avez reçu un nouveau message !');

  const handleLoginOrSignup = async () => {
    setIsLoading(true);

    // Vérifie si les champs username et password ne sont pas vides
    if (!username.trim() || !password.trim()) {
      alert('Veuillez remplir tous les champs.'); // Alerte si les champs sont vides
      return;
    }
  
    // Détermine l'URL de la requête en fonction du mode (inscription ou connexion)
    const url = (isSignup
      ? 'https://wassap.onrender.com/signup' // URL pour l'inscription
      : 'https://wassap.onrender.com/login');// URL pour la connexion
  
    try {
      // Envoie une requête POST au serveur pour l'inscription ou la connexion
      const response = await fetch(url, {
        method: 'POST', // Méthode HTTP utilisée pour la requête
        headers: {
          'Content-Type': 'application/json', // Indique que le corps de la requête est au format JSON
        },
        body: JSON.stringify({ username, password }), // Corps de la requête contenant les données d'authentification
      });
  
        // Vérifie si la réponse du serveur n'est pas correcte
        if (!response.ok) {
          setIsLoading(false);

          const data = await response.json(); // Récupère le message d'erreur en cas de réponse non valide
          throw new Error(data.message || 'Erreur lors de la connexion');
        }

        // Si la requête réussie, traite la réponse
        const data = await response.json();
        setIsLoading(false);

        alert('Contact rajouté avec succès:', data);
       
        navigation.navigate('ChatChoice', { username });

  
      } catch (error) {
        setIsLoading(false);

        // Gère les erreurs en les affichant dans la console ou en les affichant à l'utilisateur
        // console.error(isSignup ? 'Erreur lors de l\'inscription:' : 'Erreur lors de la connexion:', error);
        alert(error.message); // Affiche un message d'erreur à l'utilisateur
      }
    };
    const LoadingSpinner = () => {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25D366" />
        </View>
      );
    };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignup ? 'Inscription' : 'Connexion'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
                <Text >  {isLoading &&  <LoadingSpinner/>}</Text>
               

      <TouchableOpacity style={styles.button} onPress={handleLoginOrSignup}>
        <Text style={styles.buttonText}>{isSignup ? 'S\'inscrire' : 'Se connecter'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.toggleText}>
          {isSignup ? 'Vous avez déjà un compte ? Connectez-vous' : 'Pas de compte ? Inscrivez-vous'}
        </Text>
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#25D366',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
