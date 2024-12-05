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
import DateTimePicker from '@react-native-community/datetimepicker';

const AppointmentScreen = () => {
  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showSlotsForDate, setShowSlotsForDate] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ date: '', time: '', patient: '', reason: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  // Dummy data for booked appointments
  const dummyPatients = [
    { id: 1, name: 'John Doe', date: '2024-10-24', time: '10:00 AM', reason: 'Follow-up Consultation' },
    { id: 2, name: 'Jane Smith', date: '2024-10-25', time: '11:00 AM', reason: 'Annual Health Checkup' },
  ];

  // Initialize dummy data
  React.useEffect(() => {
    setPatients(dummyPatients);
  }, []);

  // Format time to 12-hour format
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Add new slot for a specific date
  const handleAddSlot = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date.');
      return;
    }

    const formattedTime = formatTime(newSlotTime);
    const updatedSlots = { ...slots };
    if (!updatedSlots[selectedDate]) {
      updatedSlots[selectedDate] = [];
    }
    updatedSlots[selectedDate].push(formattedTime);

    setSlots(updatedSlots);
    setShowTimePicker(false);
    setShowSlotModal(false);

    Alert.alert('Success', 'Slot added successfully.');
  };

  // Add new appointment
  const handleAddAppointment = () => {
    if (!newAppointment.patient || !newAppointment.date || !newAppointment.time) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const newPatientAppointment = {
      id: patients.length + 1,
      name: newAppointment.patient,
      date: newAppointment.date,
      time: newAppointment.time,
      reason: newAppointment.reason || 'General Consultation',
    };

    setPatients([...patients, newPatientAppointment]);
    setNewAppointment({ date: '', time: '', patient: '', reason: '' });
    setShowAddModal(false);

    Alert.alert('Success', 'Appointment added successfully.');
  };

  // Cancel an appointment
  const handleCancelAppointment = (id) => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setPatients(patients.filter((patient) => patient.id !== id));
            Alert.alert('Appointment Cancelled', 'The appointment has been removed.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Professional Header */}
      <View style={styles.headerContainer}>
        <Icon name="calendar-today" size={30} color="#2B547E" />
        <Text style={styles.headerText}>Appointment Management</Text>
      </View>

      {/* Calendar Section */}
      <View style={styles.calendarSection}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: '#2B547E'
            },
          }}
          theme={{
            todayTextColor: '#2B547E',
            selectedDayBackgroundColor: '#2B547E',
            arrowColor: '#2B547E',
          }}
          style={styles.calendar}
        />

        {/* Add Slot Button */}
        <TouchableOpacity
          style={styles.professionalButton}
          onPress={() => {
            setShowSlotModal(true);
            setNewSlotTime(new Date());
          }}
        >
          <Icon name="add-circle" size={24} color="#fff" />
          <Text style={styles.professionalButtonText}>Add Time Slot</Text>
        </TouchableOpacity>
      </View>

      {/* Slots Display */}
      {selectedDate && slots[selectedDate] && (
        <View style={styles.slotListContainer}>
          <Text style={styles.slotListTitle}>
            Available Slots for {selectedDate} ({slots[selectedDate].length})
          </Text>
          <FlatList
            data={slots[selectedDate]}
            renderItem={({ item }) => (
              <Text style={styles.slotItem}>• {item}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Appointments List */}
      <View style={styles.appointmentsSection}>
        <Text style={styles.sectionTitle}>Booked Appointments</Text>
        {patients.length > 0 ? (
          <FlatList
            data={patients}
            renderItem={({ item }) => (
              <View style={styles.appointmentCard}>
                <View style={styles.appointmentCardHeader}>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelAppointment(item.id)}
                  >
                    <Icon name="cancel" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.appointmentDetails}>
                  {item.date} | {item.time}
                </Text>
                <Text style={styles.reason}>Reason: {item.reason}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text style={styles.noAppointmentsText}>No appointments scheduled</Text>
        )}
      </View>

      {/* Add Slot Modal */}
      <Modal
        visible={showSlotModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSlotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Time Slot</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timePickerButtonText}>
                {formatTime(newSlotTime)}
              </Text>
              <Icon name="access-time" size={20} color="#2B547E" />
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={newSlotTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  setNewSlotTime(selectedTime || newSlotTime);
                }}
              />
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddSlot}
            >
              <Text style={styles.saveButtonText}>Add Slot</Text>
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
            <Text style={styles.modalTitle}>Schedule New Appointment</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Patient Name"
              placeholderTextColor="#999"
              value={newAppointment.patient}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, patient: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor="#999"
              value={newAppointment.date}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, date: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Time (e.g., 10:00 AM)"
              placeholderTextColor="#999"
              value={newAppointment.time}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, time: text })
              }
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Reason for Appointment"
              placeholderTextColor="#999"
              value={newAppointment.reason}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, reason: text })
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddAppointment}
            >
              <Text style={styles.saveButtonText}>Schedule</Text>
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
    backgroundColor: '#F7F9FC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2B547E',
    marginLeft: 10,
  },
  calendarSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 12,
    elevation: 1,
  },
  professionalButton: {
    flexDirection: 'row',
    backgroundColor: '#2B547E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  professionalButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  appointmentsSection: {
    padding: 10,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  appointmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B547E',
  },
  appointmentDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  reason: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2B547E',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#2B547E',
    marginBottom: 15,
    padding: 10,
    fontSize: 15,
    color: '#333',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderColor: '#2B547E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  timePickerButtonText: {
    fontSize: 16,
    color: '#2B547E',
  },
  saveButton: {
    backgroundColor: '#2B547E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  slotListContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    elevation: 2,
  },
  slotListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B547E',
    marginBottom: 10,
  },
  slotItem: {
    fontSize: 14,
    color: '#555',
    marginRight: 10,
  },
  noAppointmentsText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
  },
});

export default AppointmentScreen;
