import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppointmentScreen = () => {
  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showSlotsForDate, setShowSlotsForDate] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ date: '', time: '', patient: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  // Dummy data for booked appointments
  const dummyPatients = [
    { id: 1, name: 'John Doe', date: '2024-10-24', time: '10:00 AM', reason: 'Follow-up' },
    { id: 2, name: 'Jane Smith', date: '2024-10-25', time: '11:00 AM', reason: 'Routine Checkup' },
  ];

  // Initialize dummy data
  React.useEffect(() => {
    setPatients(dummyPatients);
  }, []);

  // Add new slot for a specific date
  const handleAddSlot = () => {
    if (!selectedDate || !newSlotTime) {
      Alert.alert('Error', 'Please select a date and enter a time.');
      return;
    }

    const updatedSlots = { ...slots };
    if (!updatedSlots[selectedDate]) {
      updatedSlots[selectedDate] = [];
    }
    updatedSlots[selectedDate].push(newSlotTime);

    setSlots(updatedSlots);
    setNewSlotTime('');
    setShowSlotModal(false);

    Alert.alert('Success', 'Slot added successfully.');
  };

  // View slots for a specific date
  const viewSlotsForDate = (date) => {
    setSelectedDate(date);
    setShowSlotsForDate(true);
  };

  // Add new appointment
  const handleAddAppointment = () => {
    if (!newAppointment.date || !newAppointment.time || !newAppointment.patient) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const newPatient = {
      id: patients.length + 1,
      name: newAppointment.patient,
      date: newAppointment.date,
      time: newAppointment.time,
      reason: 'Custom Appointment',
    };

    setPatients([...patients, newPatient]);
    setNewAppointment({ date: '', time: '', patient: '' });
    setShowAddModal(false);

    Alert.alert('Success', 'Appointment added successfully.');
  };

  // Cancel an appointment
  const handleCancelAppointment = (id) => {
    setPatients(patients.filter((patient) => patient.id !== id));
    Alert.alert('Appointment Cancelled', 'The appointment has been cancelled.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Doctor's Appointment Management</Text>

      {/* Calendar for Managing Slots */}
      <Text style={styles.sectionTitle}>Manage Slots</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#2B547E' },
        }}
        theme={{
          todayTextColor: '#2B547E',
          selectedDayBackgroundColor: '#2B547E',
        }}
      />

      {/* Add Slot Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowSlotModal(true)}
      >
        <Icon name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Slot</Text>
      </TouchableOpacity>

      {/* View Slots for Selected Date */}
      {selectedDate && slots[selectedDate] && (
        <View style={styles.slotListContainer}>
          <Text style={styles.slotListTitle}>
            Slots for {selectedDate} ({slots[selectedDate].length})
          </Text>
          {slots[selectedDate].map((time, index) => (
            <Text key={index} style={styles.slotItem}>
              {time}
            </Text>
          ))}
        </View>
      )}

      {/* List of Booked Appointments */}
      <Text style={styles.sectionTitle}>Booked Appointments</Text>
      {patients.length > 0 ? (
        <FlatList
          data={patients}
          renderItem={({ item }) => (
            <View style={styles.appointmentCard}>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.appointmentDetails}>
                {item.date} at {item.time}
              </Text>
              <Text style={styles.reason}>Reason: {item.reason}</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelAppointment(item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noAppointmentsText}>No appointments booked yet.</Text>
      )}

      {/* Add Slot Modal */}
      <Modal
        visible={showSlotModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSlotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Slot</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Time (e.g., 10:00 AM)"
              value={newSlotTime}
              onChangeText={(text) => setNewSlotTime(text)}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddSlot}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Appointment Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Appointment</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Patient Name"
              value={newAppointment.patient}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, patient: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Date (YYYY-MM-DD)"
              value={newAppointment.date}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, date: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Time (e.g., 10:00 AM)"
              value={newAppointment.time}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, time: text })
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddAppointment}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#2B547E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  reason: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2B547E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  slotListContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  slotListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  slotItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});

export default AppointmentScreen;
