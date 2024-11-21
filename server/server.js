// Importation des modules nécessaires
const express = require('express'); // Framework web pour Node.js
const http = require('http'); // Module HTTP pour créer le serveur
const socketIo = require('socket.io'); // WebSockets pour la communication en temps réel
const mongoose = require('mongoose'); // ODM pour interagir avec MongoDB
require('dotenv').config(); // Charge les variables d'environnement
const {WassapUser,PrivetMessage,PublicMessage} = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rooms = {}; // Stocke les utilisateurs par room

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

    // Vérifie si l'utilisateur existe et si le mot de passe est correct
    const user = await WassapUser.findOne({ username });
    const isMatch = await verifyPassword(password, user.password);

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


// Événement de connexion via WebSocket
io.on('connection', (socket) => {

  // Lorsque l'utilisateur s'enregistre
  socket.on('register', (username) => {
    console.log('Un utilisateur est connecté au serveur');

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



  socket.on('joinRoom', (currentUser, selectedUser) => {
    const roomID = [currentUser, selectedUser].sort().join('_'); // Génère un ID unique pour la room
  
    // Vérifie si la room existe déjà dans l'objet rooms, sinon la crée
    if (!rooms[roomID]) {
      rooms[roomID] = new Set();
    }
  
    // Ajoute l'utilisateur courant dans la room
    rooms[roomID].add(currentUser);
    socket.join(roomID);
    console.log(`Utilisateurs dans la salle ${roomID}:`, rooms[roomID] );

    const size = rooms[roomID].size;
  // Parcourt et affiche tous les utilisateurs dans une room donnée


// Exemple d'utilisation

    // Emet l'événement roomConnected avec la taille actuelle de la room et l'ID de la room
    socket.emit('roomConnected', { size, roomID });
  });
  
  socket.on('leaveRoom', (currentUser, selectedUser) => {
    const roomID = [currentUser, selectedUser].sort().join('_'); // Génère l'ID unique de la room
  
    // Vérifie si la room existe avant d'essayer de retirer un utilisateur
    if (rooms[roomID]) {
      // Retire l'utilisateur courant de la room
      rooms[roomID].delete(currentUser);
  
      // Retire le socket de la room `roomID`
      socket.leave(roomID);
  
      console.log(`${currentUser} a quitté la room ${roomID}, taille actuelle: ${rooms[roomID].size}`);
  
      // Si la room est vide, la supprimer de l'objet rooms pour libérer de la mémoire
      if (rooms[roomID].size === 0) {
        delete rooms[roomID];
        console.log(`La room ${roomID} est maintenant vide et a été supprimée.`);
      }
    } else {
      console.log(`La room ${roomID} n'existe pas ou est déjà vide.`);
    }
  });
  
  


// Envoi d'un message privé
socket.on('send_private_message', async ({ text, to, from }) => {
  const roomID = [from, to].sort().join('_'); // Utilisez la même room basée sur les IDs
  const size = rooms[roomID]?.size || 0; // Assurez-vous que la taille de la room est définie

  // Récupération des sockets pour les utilisateurs de la room
  const userSockets = roomID.split('_').map(user => users.get(user));
  const recipientSocket = users.get(to); // Socket du destinataire
  const senderSocket = users.get(from);  // Socket de l'expéditeur
  io.to(roomID).emit('send_pvMessage', { text, to, from });

  if (size !== 2) {
    // Si la room n'a pas exactement 2 utilisateurs, trouvez le bon destinataire
    if (recipientSocket && userSockets.includes(recipientSocket)) {

      // Envoyez la notification au destinataire si sa socket existe
      io.to(recipientSocket.id).emit('send_notification', { text, from, size });
      console.log(`Notification sent to user ${to} with socket ID ${recipientSocket.id}`);
    } else if (senderSocket) {

      // Si le destinataire n'est pas présent, envoyez la notification à l'expéditeur
      io.to(senderSocket.id).emit('send_notification', { text, from, size });
      console.log(`Notification sent to sender ${from} with socket ID ${senderSocket.id}`);
    }
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

  
  // Gestion de la déconnexion d'un utilisateur
  socket.on('disconnect', () => {
    users.delete(socket.username); // Supprime l'utilisateur de la Map
    io.emit('update_users', Array.from(users.keys())); // Envoie la liste mise à jour des utilisateurs
  });
});

// Démarrage du serveur sur le port 8080
server.listen(8080, () => {
  console.log('Serveur en écoute sur le port 8080');
});