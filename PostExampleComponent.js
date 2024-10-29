// PostExampleComponent.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { postData } from './server/apiService'; // Assurez-vous que le chemin est correct

const PostExampleComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const result = await postData('/post-endpoint', { data: inputValue }); // Remplacez par le bon endpoint et les données
      setResponse(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Enter something"
      />
      <Button title="Submit" onPress={handleSubmit} />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {response && <Text>Response: {JSON.stringify(response, null, 2)}</Text>}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
  },
});

export default PostExampleComponent;
