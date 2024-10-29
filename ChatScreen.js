// ChatScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatScreen = ({ route }) => {
  const { username, selectedUser } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat avec {selectedUser}</Text>
      {/* Add your chat messages and input here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
