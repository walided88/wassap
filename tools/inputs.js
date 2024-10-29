import React, { useState } from 'react';
import { TextInput, StyleSheet, View,SafeAreaView ,Text} from 'react-native';

const App = () => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
          <SafeAreaView style={styles.container}>
    <Text>Contenu dans la zone sécurisée</Text>
  </SafeAreaView>

      <TextInput
        style={styles.input}
        placeholder="Tapez quelque chose"
        value={text}
        onChangeText={setText}

        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },


  container: {
    flex: 1,
    justifyContent: 'center',
  },

});

export default App;
