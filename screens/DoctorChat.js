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
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import io from 'socket.io-client';
import moment from 'moment';

const { width } = Dimensions.get('window');

const DoctorChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId, patientName, patientAvatar } = route.params;

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

    socket.current.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        `http://192.168.18.25:3001/get_chat_history/${userData._id}/${patientId}`
      );

      const fetchedMessages = response.data.messages || [];
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to fetch messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !userData) return;

    const messageData = {
      doctorId: userData._id,
      patientId,
      senderId: userData._id,
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, messageData]);
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
    const isSentByDoctor = item.senderId === userData._id;
    const formattedTime = moment(item.timestamp).format('HH:mm');

    return (
      <View
        style={[
          styles.messageContainer,
          isSentByDoctor
            ? styles.userMessageContainer
            : styles.patientMessageContainer,
        ]}
      >
        {!isSentByDoctor && patientAvatar && (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: patientAvatar }} style={styles.avatar} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isSentByDoctor ? styles.userMessageBubble : styles.patientMessageBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.messageTime}>{formattedTime}</Text>
        </View>
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
    <View style={styles.container}>
      <View style={[styles.header, styles.blueGradientBackground]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerProfileContainer}>
          {patientAvatar && (
            <Image source={{ uri: patientAvatar }} style={styles.headerAvatar} />
          )}
          <Text style={styles.headerTitle}>{patientName}</Text>
        </View>
        <TouchableOpacity style={styles.videoCallButton}>
          <Ionicons name="videocam" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your message..."
            placeholderTextColor="#A5A5A5"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  videoCallButton: {
    padding: 8,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  patientMessageContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userMessageBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  patientMessageBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    color: 'rgba(0,0,0,0.5)',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  sendButtonDisabled: {
    backgroundColor: '#B3D4FC',
  },
});


export default DoctorChat;
