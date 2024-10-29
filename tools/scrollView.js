import React from 'react';
import { Text, StyleSheet,Image,View,ScrollView,FlatList,SectionList,TouchableOpacity,TouchableHighlight,Button } from 'react-native';


const DATA = [
    { id: '1', title: 'Élément 1' },
    { id: '2', title: 'Élément 2' },
    { id: '3', title: 'Élément 1' },
    { id: '4', title: 'Élément 2' },
  ];


  const DATA2 = [
    {
      title: 'Section 1',
      data: ['Élément 1', 'Élément 2'],
    },
    {
      title: 'Section 2',
      data: ['Élément 3', 'Élément 4'],
    },
  ];
  

const App = () => (


  <View style={styles.container}>
  <Text style={styles.text}>Bonjour, monde !</Text>
  <Image
    source={{ uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg' }}
    style={styles.image}
  />
  <ScrollView style={styles.container}>
    <Text>Élément 1</Text>
    <Text>Élément 2</Text>
    <Text>Élément 3</Text>
    <Text>Élément 1</Text>
    <Text>Élément 2</Text>
    <Text>Élément 3</Text> 
  
    </ScrollView>
    <FlatList
    data={DATA}
    renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
    keyExtractor={item => item.id}
  />
  <SectionList
    sections={DATA2}
    renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
    renderSectionHeader={({ section: { title } }) => (
      <Text style={styles.header}>{title}</Text>
    )}
    keyExtractor={(item, index) => item + index}
  />

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
