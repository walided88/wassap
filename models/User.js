const mongoose = require('mongoose');


// Schéma pour les messages publics
const publicMessageSchema = new mongoose.Schema({
  text:{ type: Object, required: true },
  from: String,
  to: String,
  timestamp: { type: Date, default: Date.now }, // Date et heure de l'envoi
});

// Modèle pour les messages publics basé sur le schéma
const PublicMessage = mongoose.model('PublicMessage', publicMessageSchema);

// Schéma pour les messages privés
const privetMessageSchema = new mongoose.Schema({
  text: String,
  from: String,
  to: String,
  timestamp: { type: Date, default: Date.now }, // Date et heure de l'envoi
});

// Modèle pour les messages privés basé sur le schéma
const PrivetMessage = mongoose.model('PrivetMessage', privetMessageSchema);

// Schéma pour les utilisateurs de Wassap avec une liste de contacts
const wassapUsersSchema = new mongoose.Schema({
  username: String,
  password: String,
  onlineWith: { type: String, default: "void" },
  notifications:{ type: Number, default: 0 },
  contacts: [{
    contactName: String,
    timestamp: { type: Date, default: Date.now }, // Date d'ajout du contact
  }],
  timestamp: { type: Date, default: Date.now }, // Date de création du compte
});

// Modèle pour les utilisateurs basé sur le schéma
const WassapUser = mongoose.model('WassapUser', wassapUsersSchema);



module.exports = {WassapUser,PrivetMessage,PublicMessage};
