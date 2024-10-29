import React from 'react';
import { ImageBackground, Text, StyleSheet } from 'react-native';

const App = () => (
  <ImageBackground
    source={{ uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg' }}
    style={styles.imageBackground}
  >
    <Text style={styles.text}>Texte sur l'image de fond</Text>
  </ImageBackground>
);

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});

export default App;
