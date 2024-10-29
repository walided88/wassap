import React from 'react';
import { Text, StyleSheet,Image,View,ScrollView,FlatLis,SectionList,TouchableOpacity,TouchableHighlight } from 'react-native';





const App = () => (


  <View style={styles.container}>
  <Text style={styles.text}>Bonjour, monde !</Text>
  <Image
    source={{ uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg' }}
    style={styles.image}
  />
 
<TouchableOpacity style={styles.button} onPress={() => alert('Cliquez')}>
    <Text style={styles.buttonText}>Cliquez-moi</Text>
  </TouchableOpacity>

  <TouchableHighlight
    style={styles.button}
    onPress={() => alert('Cliquez')}
    underlayColor="#0056b3"
  >
    <Text style={styles.buttonText}>Cliquez-moi</Text>
  </TouchableHighlight>







  </View>
  
);

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
  },

  container: {
    padding: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  item: {
    padding: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: '#f4f4f4',
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },

  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },

});

export default App;
