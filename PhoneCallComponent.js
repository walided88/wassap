import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import call from 'react-native-phone-call';

const PhoneCallComponent = () => {
  const makeCall = () => {
    const args = {
      number: '1234567890', // Remplacez par le numéro de téléphone que vous souhaitez appeler
      prompt: true, // Affiche une invite avant de passer l'appel
    };

    call(args).catch(console.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Appuyer sur le bouton pour passer un appel</Text>
      <Button title="Passer un appel" onPress={makeCall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    marginBottom: 20,
  },
});

export default PhoneCallComponent;
