// Importation des modules nécessaires
const express = require('express'); // Framework web pour Node.js
const http = require('http'); // Module HTTP pour créer le serveur
const socketIo = require('socket.io'); // WebSockets pour la communication en temps réel
const mongoose = require('mongoose'); // ODM pour interagir avec MongoDB
require('dotenv').config(); // Charge les variables d'environnement
const {WassapUser,PrivetMessage,PublicMessage} = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express(); // Création de l'application Express
const server = http.createServer(app); // Création du serveur HTTP
const io = socketIo(server); // Attachement de Socket.IO au serveur pour le WebSocket
const cors = require('cors'); // Middleware pour autoriser les requêtes cross-origin
app.use(cors()); // Utilisation de CORS pour autoriser toutes les origines

// Middleware pour parser les corps des requêtes en JSON
app.use(express.json()); 

// Map pour stocker les utilisateurs connectés
const users = new Map(); 




// Fonction pour hacher un mot de passe
const hashPassword = async (password) => {
  try {
    // Génération d'un salt
    const salt = await bcrypt.genSalt(10);
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
  }
};

// Fonction pour vérifier un mot de passe
const verifyPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match; // true si le mot de passe correspond, false sinon
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
  }
};
// Connexion à la base de données MongoDB en utilisant une URI stockée dans le fichier .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));


// Événement de connexion via WebSocket
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté au serveur');

  // Lorsque l'utilisateur s'enregistre
  socket.on('register', (username) => {
    users.set(username, socket); // Ajoute l'utilisateur au Map des utilisateurs connectés
    socket.username = username; // Associe le nom d'utilisateur à la socket
    io.emit('update_users', Array.from(users.keys())); // Envoie la liste mise à jour des utilisateurs à tous les clients
  });

  // Demande de la liste des utilisateurs connectés
  socket.on('get_users', () => {
    socket.emit('users_list', Array.from(users.keys())); // Envoie la liste des utilisateurs
  });
  // Demande de la liste des utilisateurs connectés
  socket.on('user_in_privateChat',(username) => {
    const recipientSocket = users.get(username); // Trouve la socket du destinataire
     const tokenUser="cxx";
     
    recipientSocket.emit('token_user', { tokenUser });
  });




  // Envoi d'un message privé
  socket.on('send_private_message', async ({ text, to, from }) => {
    const recipientSocket = users.get(to); // Trouve la socket du destinataire**
    socket.join(from); // Lors de la connexion d'un utilisateur, rejoins une room basée sur son ID
    recipientSocket.join(from); // Lors de la connexion d'un utilisateur, rejoins une room basée sur son ID

    io.to(to).emit('private_message', { text, from });
    socket.emit('private_message', { text, from });

    if (recipientSocket) {

      recipientSocket.emit('is_offline', { text, from });
  } else {
      console.log(`User ${to} is not connected`);
      // Optionally handle sending a notification or storing the message
  }
    // Sauvegarde du message privé dans MongoDB
    try {
      const newMessage = new PrivetMessage({ text, from, to });
      await newMessage.save();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
    }
  });

  // Envoi d'un message public
  socket.on('public_message', async (data) => {
    io.emit('public_message', data); // Diffusion du message à tous les utilisateurs

    // Sauvegarde du message public dans MongoDB
    try {
      const newMessage = new PublicMessage({ text: data.text, from: data.from, to: 'public' });
      await newMessage.save();
      console.log('Message public sauvegardé dans MongoDB');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message public dans MongoDB:', error);
    }
  });

  // Récupération des messages publics via une requête HTTP GET
  app.get('/publicMessages', async (req, res) => {
    try {
      const messages = await PublicMessage.find();
      res.json(messages); // Envoie des messages publics en réponse
    } catch (error) {
      res.status(500).send('Erreur lors de la récupération des messages');
    }
  });

  // Récupération des messages privés via une requête HTTP GET
  app.get('/privetMessages', async (req, res) => {
    try {
      const messages = await PrivetMessage.find();
      res.json(messages); // Envoie des messages privés en réponse
    } catch (error) {
      res.status(500).send('Erreur lors de la récupération des messages');
    }
  });




  // Route pour la connexion de l'utilisateur
  app.post('/login', async (req, res) => {
    
    try {
      const { username, password } = req.body;
      const hashedPassword = await hashPassword(password);
      const isMatch = await verifyPassword(password, hashedPassword);

      // Vérifie si l'utilisateur existe et si le mot de passe est correct
      const user = await WassapUser.findOne({ username });
      if ((user.username!==username)|| (!isMatch)) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      res.status(200).json({ message: 'Login successful', user }); // Réponse en cas de succès
    } catch (error) {
      res.status(500).json({message: 'Invalid username or password' });
    }
  });


  // Route pour l'inscription d'un nouvel utilisateur
  app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await hashPassword(password);

      // Vérifie si l'utilisateur existe déjà
      const userExist = await WassapUser.findOne({ username });
      if (userExist) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Crée un nouvel utilisateur et le sauvegarde dans la base de données
      const newUser = new WassapUser({ username, password:hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'Signup successful', newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });





// Récupération des informations d'un utilisateur spécifique par son nom d'utilisateur
app.get('/:username', async (req, res) => {
  const { username } = req.params; // Récupère le paramètre 'username' depuis l'URL
  try {
    const user = await WassapUser.findOne({ username }); // Recherche de l'utilisateur dans la base de données
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' }); // Si l'utilisateur n'est pas trouvé
    }
    res.json(user); // Envoie des informations de l'utilisateur en réponse
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération de l\'utilisateur'); // Gestion des erreurs
  }
});

  // Route pour ajouter un contact à un utilisateur
app.put('/addContact', async (req, res) => {
  const { contactName, username } = req.body; // Récupération du contact et de l'utilisateur à partir du corps de la requête
  console.log(contactName, username, "est le contactName et username reçus en serveur");

  try {
    // Recherche de l'utilisateur avec le contactName (en supposant que contactName est le username du contact)
    const contact = await WassapUser.findOne({ username: contactName });
    const user = await WassapUser.findOne({ username });

    console.log(contact, "est le contact reçu en serveur");
    console.log("L'utilisateur reçu en serveur est", user);

    if (!contact) {
      return res.status(400).json({ message: 'Aucun utilisateur trouvé avec ce nom d’utilisateur' });
    }

    // Vérifier si le contact existe déjà dans la liste des contacts de l'utilisateur
    const isExist = user.contacts.some(c => c.contactName === contact.username);

    if (isExist) {
      return res.status(400).json({ message: 'L’utilisateur existe déjà dans les contacts.' });
    }

    // Ajoute le contact à la liste des contacts de l'utilisateur
    user.contacts.push({ contactName: contact.username, timestamp: Date.now() });
    await user.save(); // Sauvegarde les modifications

    res.status(200).json({ message: 'Contact ajouté avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/onlinWith', async (req, res) => {
  const { currentUser, selectedUser } = req.body; // Récupération du contact et de l'utilisateur à partir du corps de la requête

  try {
    // Recherche de l'utilisateur avec le contactName (en supposant que contactName est le username du contact)
    const contact = await WassapUser.findOne({ username: selectedUser });
    const user = await WassapUser.findOne({ username: currentUser });

    if (!contact) {
      user.onlineWith = "void";
      await user.save(); // Sauvegarde les modifications
    }
    else{
       // Ajoute le contact à la liste des contacts de l'utilisateur
    user.onlineWith = contact._id;
    await user.save(); // Sauvegarde les modifications

    }

    res.status(200).json({ message: 'Contact ajouté avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  // Gestion de la déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    users.delete(socket.username); // Supprime l'utilisateur de la Map
    io.emit('update_users', Array.from(users.keys())); // Envoie la liste mise à jour des utilisateurs
  });
});

// Démarrage du serveur sur le port 8080
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
