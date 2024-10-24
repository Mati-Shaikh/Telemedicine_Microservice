import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const MessageList = ({ messages }) => {
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'User1' ? styles.userMessage : styles.doctorMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      inverted
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  doctorMessage: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
});

export default MessageList;