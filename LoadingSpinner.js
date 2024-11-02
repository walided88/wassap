import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';

const messages = [
  "         Veuillez patienter",
  "         Temps d'attente estimé : 1 min",
  "         Merci de votre patience",
];

const LoadingSpinner = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current; // Valeur d'opacité initiale

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Animation de disparition
      Animated.timing(opacity, {
        toValue: 0, // Fade out
        duration: 500, // Durée de l'animation
        useNativeDriver: true,
      }).start(() => {
        // Changer le message après l'animation
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);

        // Animation d'apparition
        Animated.timing(opacity, {
          toValue: 1, // Fade in
          duration: 500, // Durée de l'animation
          useNativeDriver: true,
        }).start();
      });
    }, 5000); // Intervalle de 5 secondes

    return () => clearInterval(intervalId); // Nettoyage lors de la destruction du composant
  }, [opacity]);

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.messageContainer}>
        <Animated.View style={{ opacity }}>
          <Text style={styles.loadingMessage}>
            {messages[currentMessageIndex]}
          </Text>
        </Animated.View>
      </View>
      <ActivityIndicator style={styles.activityIndicator} size="large" color="#25D366" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    position: 'absolute', // Positionner le conteneur du message de façon absolue
    top: '40%', // Ajuster en fonction de votre besoin
    alignItems: 'center',
  },
  loadingMessage: {
    marginBottom: 10, // Ajoute une marge entre le message et le loader
    textAlign: 'center', // Centre le texte
    right: -51, // Ajoutez une marge pour le placer sous le message

  },
  activityIndicator: {
    marginTop: 50, // Ajoutez une marge pour le placer sous le message
    right: -51, // Ajoutez une marge pour le placer sous le message

  },
});

export default LoadingSpinner;
