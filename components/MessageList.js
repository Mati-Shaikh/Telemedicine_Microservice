import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';

const MessageList = ({ messages }) => {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <Text style={styles.message}>{item.sender}: {item.text}</Text>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MessageList;
