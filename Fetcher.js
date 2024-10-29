


export const handleAddContact = async ({ currentUser, selectedUser }) => {
    console.log(userInfos.onlineWith,"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

    // Détermine l'URL de la requête en fonction du mode (inscription ou connexion)
    const url = `http://192.168.11.210:8080/onlinWith`; // URL pour l'inscription
  
    try {
      // Envoie une requête PUT au serveur pour ajouter le contact
      const response = await fetch(url, {
        method: 'PUT', // Utilise la méthode PUT
        headers: {
          'Content-Type': 'application/json', // Indique que le corps de la requête est au format JSON
        },
        body: JSON.stringify({ currentUser, selectedUser }), // Corps de la requête contenant currentUser et selectedUser
      });
  
      // Vérifie si la réponse est correcte
      if (!response.ok) {
        const data = await response.json(); // Récupère le message d'erreur en cas de réponse non valide
        throw new Error(data.message || 'Erreur lors de l\'opération');
      }
  
   
    } catch (error) {
      // Gère les erreurs en affichant un message
      alert(error.message); // Affiche un message d'erreur à l'utilisateur
    }
  };
  

  export default Fetcher;
