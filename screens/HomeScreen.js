import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('DoctorList')}
        >
          <Ionicons name="chatbubbles" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Real-time Chat Consultation</Text>
          <Text style={styles.cardDescription}>
            Connect with doctors instantly via chat
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Ionicons name="videocam" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Video Consultation</Text>
          <Text style={styles.cardDescription}>
            Schedule video calls with specialists
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
