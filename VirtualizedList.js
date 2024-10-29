import React from 'react';
import { VirtualizedList, Text, StyleSheet } from 'react-native';

const DATA = Array.from({ length: 100 }).map((_, index) => ({
  id: index,
  title: `Élément ${index + 1}`,
}));

const getItem = (data, index) => data[index];

const getItemCount = data => data.length;

const App = () => (
  <VirtualizedList
    data={DATA}
    initialNumToRender={10}
    renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
    keyExtractor={item => item.id.toString()}
    getItemCount={getItemCount}
    getItem={getItem}
  />
);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
