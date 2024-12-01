import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import io from 'socket.io-client';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorId, doctorName } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const flatListRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    loadUserData();
    initSocket();

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userData) {
      fetchMessages();
    }
  }, [userData]);

  const initSocket = () => {
    socket.current = io('http://192.168.18.25:3001');

    // Listening for messages sent by others
    socket.current.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      saveMessages([...messages, newMessage]);
      flatListRef.current?.scrollToEnd();
    });
  };

  const loadUserData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('token');
      if (storedData) {
        const base64Url = storedData.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));
        setUserData(decodedData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://192.168.18.25:3001/get_chat_history/${doctorId}/${userData._id}`
      );

      const fetchedMessages = response.data.messages || [];
      setMessages(fetchedMessages);
      saveMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to fetch messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !userData) return;

    const messageData = {
      doctorId,
      patientId: userData._id,
      senderId: userData._id,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Immediately show the sent message in UI
    setMessages((prevMessages) => [...prevMessages, messageData]);
    saveMessages([...messages, messageData]);
    setInputMessage('');
    flatListRef.current?.scrollToEnd();

    try {
      await axios.post('http://192.168.18.25:3001/send_message', messageData);
      socket.current.emit('send_message', messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }) => {
    const isSentByDoctor = item.senderId !== doctorId;

    return (
      <View
        style={[
          styles.messageBubble,
          isSentByDoctor ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isSentByDoctor ? styles.sentMessageText : styles.receivedMessageText,
          ]}
        >
          {item.message}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{doctorName}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputMessage.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputMessage.trim() ? '#007AFF' : '#A5A5A5'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
