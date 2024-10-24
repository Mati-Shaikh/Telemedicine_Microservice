import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ConsultScreen = ({ navigation }) => {
  const consultOptions = [
    {
      title: 'Real-time Chat',
      description: 'Chat with doctors instantly',
      onPress: () => navigation.navigate('DoctorListScreen')
    },
    {
      title: 'Video Consultation',
      description: 'Schedule video appointments',
      onPress: () => {/* Handle video consultation */}
    },
    {
      title: 'Voice Call',
      description: 'Talk to doctors directly',
      onPress: () => {/* Handle voice call */}
    }
  ];

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    marginTop: 15,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  doctorCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

  return (
    <View style={styles.container}>
      {consultOptions.map((option, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.optionCard}
          onPress={option.onPress}
        >
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
export default ConsultScreen;