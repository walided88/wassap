import React from 'react';
import { KeyboardAvoidingView, TextInput, StyleSheet } from 'react-native';

const App = () => (
  <KeyboardAvoidingView style={styles.container} behavior="padding">
    <TextInput style={styles.input} placeholder="Tapez ici" />
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default App;
