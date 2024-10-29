import React from 'react';
import { Button, ToastAndroid, View } from 'react-native';

const App = () => {
  const showToast = () => {
    ToastAndroid.show('Ceci est un toast !', ToastAndroid.SHORT);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Afficher un toast" onPress={showToast} />
    </View>
  );
};

export default App;
