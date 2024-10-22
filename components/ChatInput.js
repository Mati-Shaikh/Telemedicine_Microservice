import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        style={styles.input}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
  },
});

export default ChatInput;
