// src/screens/ConsultScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorConsultScreen = ({ navigation }) => {
  const consultOptions = [
    {
      title: 'Real-time Chat',
      description: 'Chat with Patients instantly',
      icon: 'chat',
      onPress: () => navigation.navigate('PatientsListScreen'),
    },
    {
      title: 'Audio Call',
      description: 'Talk to Patients directly',
      icon: 'call',
      onPress: () => navigation.navigate('DoctorChatRoom'),
    },
    //     {
    //   title: 'Audio Call',
    //   description: 'Talk to doctors directly',
    //   icon: 'call',
    //   onPress: () => navigation.navigate('DoctorListScreen'),
    // },

  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Choose Consultation Type</Text>
        <View style={styles.cardsContainer}>
          {consultOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={option.onPress}
            >
              <View style={styles.iconContainer}>
                <Icon name={option.icon} size={40} color="#2B547E" />
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 20,
  },
  cardsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default DoctorConsultScreen;