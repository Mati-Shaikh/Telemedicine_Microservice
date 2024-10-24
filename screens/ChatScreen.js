import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../socket';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';

const ChatScreen = ({ route }) => {
  const { doctor } = route.params;
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (text) => {
    if (socket) {
      const message = {
        text,
        sender: 'User1',
        timestamp: new Date().toISOString(),
        doctorId: doctor.id,
      };
      socket.emit('sendMessage', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ChatScreen;