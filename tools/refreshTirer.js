import React, { useState } from 'react';
import { ScrollView, RefreshControl, Text, StyleSheet } from 'react-native';

const App = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.text}>Tirez pour actualiser !</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 20,
  },
});

export default App;
