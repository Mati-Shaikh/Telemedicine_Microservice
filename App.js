import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import { SOCKET_SERVER_URL } from './socket';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null); // Initialize socket state

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL); // Create socket connection
    setSocket(newSocket); // Set socket in state

    newSocket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect(); // Disconnect on cleanup
    };
  }, []);

  const sendMessage = (text) => {
    if (socket) { // Check if socket is defined
      const message = { text, sender: 'User1' }; // Add sender info if needed
      socket.emit('sendMessage', message);
      setMessages((prevMessages) => [...prevMessages, message]); // Update local state
    } else {
      console.error("Socket is not initialized");
    }
  };

  return (
    <View style={styles.container}>
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default App;
