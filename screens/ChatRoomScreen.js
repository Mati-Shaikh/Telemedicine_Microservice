// src/screens/ChatRoomScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  TextInput,
  FlatList,
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatRoomScreen = ({ route, navigation }) => {
  const { doctor } = route.params;
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatRef = useRef();

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(`chat_${doctor.id}`);
      if (history) {
        setChatHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(`chat_${doctor.id}`, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      
      const updatedHistory = [...chatHistory, newMessage];
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
      setMessage('');
      
      chatRef.current?.scrollToEnd();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: doctor.image }} style={styles.headerImage} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{doctor.name}</Text>
            <Text style={styles.headerSpecialty}>{doctor.specialty}</Text>
          </View>
        </View>

        <FlatList
          ref={chatRef}
          data={chatHistory}
          style={styles.chatContainer}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.doctorMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.sender === 'user' && { color: '#fff' }
              ]}>{item.text}</Text>
              <Text style={[
                styles.messageTime,
                item.sender === 'user' && { color: '#ddd' }
              ]}>
                {new Date(item.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          onContentSizeChange={() => chatRef.current?.scrollToEnd()}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#666"
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2B547E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    elevation: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpecialty: {
    color: '#ddd',
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 12,
    borderRadius: 15,
  },
  userMessage: {
    backgroundColor: '#2B547E',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  doctorMessage: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
    color: '#333',
  },
   sendButton: {
    backgroundColor: '#2B547E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ChatRoomScreen;