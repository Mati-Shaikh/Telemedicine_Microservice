import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo vector icons

const Feedback = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://192.168.18.25:3001/auth/fetchDoctors');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert('Error', 'Failed to fetch doctors.');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  // Submit feedback
  const submitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `http://192.168.18.25:3001/feedback/give-feedback/${selectedDoctor._id}`,
        { feedback },
        { headers: { token } }
      );
      Alert.alert('Success', 'Feedback submitted successfully!');
      setFeedback('');
      setFeedbackModalVisible(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback.');
    }
  };

  // Render doctor item
  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => {
        setSelectedDoctor(item);
        setFeedbackModalVisible(true);
      }}
    >
      <View style={styles.doctorItemContent}>
        <View style={styles.doctorAvatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorSpecialty}>
            {item.specialty || 'General Physician'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#008080" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.title}>Doctor Feedback</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Doctors List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item._id}
        renderItem={renderDoctorItem}
        contentContainerStyle={styles.doctorList}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No doctors found</Text>
          </View>
        )}
      />

      {/* Feedback Modal */}
      <Modal visible={feedbackModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Give Feedback</Text>
              <TouchableOpacity
                onPress={() => setFeedbackModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.selectedDoctorInfo}>
              <View style={styles.modalDoctorAvatar}>
                <Text style={styles.modalAvatarText}>
                  {selectedDoctor?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.selectedDoctorName}>{selectedDoctor?.name}</Text>
            </View>

            <TextInput
              style={styles.feedbackInput}
              placeholder="Write your feedback..."
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  doctorList: {
    padding: 16,
  },
  doctorItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  doctorItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  selectedDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalDoctorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDoctorName: {
    fontSize: 16,
    color: '#333',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    height: 120,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Feedback;