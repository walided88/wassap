// apiService.js
import axios from 'axios';

// Configurez l'instance d'axios avec votre URL de base
const api = axios.create({
  baseURL: 'https://api.example.com', // Remplacez par l'URL de votre API
  timeout: 10000, // Temps d'attente avant d'abandonner la requête
});

// Fonction pour obtenir des données
export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

// Fonction pour poster des données
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données:', error);
    throw error;
  }
};
