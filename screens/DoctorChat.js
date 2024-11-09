// src/screens/DoctorChatRoomScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  TextInput,
  FlatList,
  SafeAreaView,
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DoctorChatRoomScreen = ({ route, navigation }) => {
  // Add default values for patient
  const defaultPatient = {
    id: 'default',
    name: 'Patient',
    image: 'https://via.placeholder.com/40',
    lastVisit: 'No previous visits'
  };

  // Safely access patient data with default values
  const patient = route?.params?.patient || defaultPatient;
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatRef = useRef();

  useEffect(() => {
    loadChatHistory();
    // Set up a timer to simulate receiving messages
    const messageInterval = setInterval(() => {
      simulateIncomingMessage();
    }, 15000);

    return () => clearInterval(messageInterval);
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(`chat_${patient.id}`);
      if (history) {
        setChatHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(`chat_${patient.id}`, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const simulateIncomingMessage = () => {
    const sampleMessages = [
      "Doctor, I've been taking the prescribed medication but still feel dizzy.",
      "When should I schedule my next appointment?",
      "The symptoms have improved since yesterday.",
      "Should I continue with the current dosage?",
    ];

    const randomMessage = {
      id: Date.now(),
      text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      sender: 'patient',
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...chatHistory, randomMessage];
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
    chatRef.current?.scrollToEnd();
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'doctor',
        timestamp: new Date().toISOString(),
      };
      
      const updatedHistory = [...chatHistory, newMessage];
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
      setMessage('');
      
      chatRef.current?.scrollToEnd();
    }
  };

  // Default profile image in case the image URL is invalid
  const handleImageError = (error) => {
    console.log('Image loading error:', error);
    return { uri: 'https://via.placeholder.com/40' };
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
          <Image 
            source={{ uri: patient.image }}
            //defaultSource={require('../assets/default-avatar.png')} // Make sure to add this image to your assets
            onError={handleImageError}
            style={styles.headerImage} 
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{patient.name}</Text>
            <Text style={styles.headerStatus}>
              {patient.lastVisit ? `Last visit: ${patient.lastVisit}` : 'New Patient'}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={chatRef}
          data={chatHistory}
          style={styles.chatContainer}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.sender === 'doctor' ? styles.doctorMessage : styles.patientMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.sender === 'doctor' && { color: '#fff' }
              ]}>{item.text}</Text>
              <Text style={[
                styles.messageTime,
                item.sender === 'doctor' && { color: '#ddd' }
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

        <View style={styles.quickReplies}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={styles.quickReplyButton}
              onPress={() => setMessage("Please schedule an appointment with my secretary.")}
            >
              <Text style={styles.quickReplyText}>Schedule Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickReplyButton}
              onPress={() => setMessage("Continue with the prescribed medication and monitor symptoms.")}
            >
              <Text style={styles.quickReplyText}>Continue Medication</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickReplyButton}
              onPress={() => setMessage("If symptoms persist, please visit the emergency room.")}
            >
              <Text style={styles.quickReplyText}>Emergency Instructions</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

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
    backgroundColor: '#4A90E2',
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
    backgroundColor: '#ddd', // Fallback background color
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: '#ddd',
    fontSize: 14,
  },
  moreButton: {
    padding: 5,
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
  doctorMessage: {
    backgroundColor: '#4A90E2',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  patientMessage: {
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
  quickReplies: {
    height: 50,
    paddingHorizontal: 10,
  },
  quickReplyButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
  },
  quickReplyText: {
    color: '#4A90E2',
    fontSize: 14,
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
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoctorChatRoomScreen;