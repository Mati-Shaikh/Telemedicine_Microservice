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

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { doctorId, doctorName, doctorAvatar } = route.params;

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
      const isSentByUser = item.senderId === userData._id;
      const formattedTime = moment(item.timestamp).format('HH:mm');

      return (
        <View style={[
          styles.messageContainer,
          isSentByUser ? styles.userMessageContainer : styles.doctorMessageContainer
        ]}>
          {!isSentByUser && doctorAvatar && (
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: doctorAvatar }}
                style={styles.avatar}
              />
            </View>
          )}
          <View style={[
            styles.messageBubble,
            isSentByUser ? styles.userMessageBubble : styles.doctorMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              isSentByUser ? styles.userMessageText : styles.doctorMessageText
            ]}>
              {item.message}
            </Text>
            <Text style={[
              styles.messageTime,
              isSentByUser ? styles.userMessageTime : styles.doctorMessageTime
            ]}>
              {formattedTime}
            </Text>
          </View>
        </View>
      );
    };

    if (loading) {
      return (
        <View style={[styles.loadingContainer, styles.blueGradientBackground]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Enhanced Header */}
        <View style={[styles.header, styles.blueGradientBackground]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerProfileContainer}>
            {doctorAvatar && (
              <Image
                source={{ uri: doctorAvatar }}
                style={styles.headerAvatar}
              />
            )}
            <View>
              <Text style={styles.headerTitle}>{doctorName}</Text>
              <Text style={styles.headerSubtitle}>Busy</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.videoCallButton}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="attach" size={24} color="#007AFF" />
            </TouchableOpacity>
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
                !inputMessage.trim() && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputMessage.trim()}
            >
              <View style={styles.sendButtonGradient}>
                <Ionicons
                  name="send"
                  size={20}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    blueGradientBackground: {
      backgroundColor: '#007AFF',
    },
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
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
      paddingTop: 40,
      justifyContent: 'space-between',
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
    marginRight:170,
      fontSize: 18,
      fontWeight: '700',
      color: '#fff',
    },
    headerSubtitle: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
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
    },
    doctorMessageContainer: {
      justifyContent: 'flex-start',
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
    doctorMessageBubble: {
      backgroundColor: '#E5E5EA',
      alignSelf: 'flex-start',
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    userMessageText: {
      color: '#fff',
    },
    doctorMessageText: {
      color: '#000',
    },
    messageTime: {
      fontSize: 10,
      marginTop: 4,
    },
    userMessageTime: {
      color: 'rgba(255,255,255,0.7)',
      alignSelf: 'flex-end',
    },
    doctorMessageTime: {
      color: 'rgba(0,0,0,0.4)',
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
    attachmentButton: {
      marginRight: 10,
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
    sendButtonGradient: {
      width: '100%',
      height: '100%',
      borderRadius: 22.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });

  export default ChatScreen;