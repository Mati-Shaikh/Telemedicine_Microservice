import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, Image, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Dummy doctor data
 const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      rating: 4.8,
      experience: '15 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['09:00', '10:00', '14:00', '15:00', '16:00'],
        '2024-10-25': ['09:00', '11:00', '14:00', '16:00'],
        '2024-10-26': ['10:00', '11:00', '15:00', '16:00'],
      }
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrician',
      rating: 4.9,
      experience: '12 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['09:30', '10:30', '14:30', '15:30'],
        '2024-10-25': ['09:30', '11:30', '14:30', '16:30'],
        '2024-10-26': ['10:30', '11:30', '15:30', '16:30'],
      }
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatologist',
      rating: 4.7,
      experience: '10 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['08:00', '11:00', '13:00', '16:00'],
        '2024-10-25': ['09:00', '12:00', '14:00', '17:00'],
        '2024-10-26': ['10:00', '13:00', '15:00', '16:00'],
      }
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedic Surgeon',
      rating: 4.9,
      experience: '18 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['08:30', '10:30', '13:30', '15:30'],
        '2024-10-25': ['09:30', '11:30', '14:30', '16:30'],
        '2024-10-26': ['08:30', '11:30', '14:30', '16:30'],
      }
    },
    {
      id: 5,
      name: 'Dr. Sophia Patel',
      specialty: 'Neurologist',
      rating: 4.8,
      experience: '14 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['09:00', '11:00', '14:00', '16:00'],
        '2024-10-25': ['08:00', '10:00', '13:00', '15:00'],
        '2024-10-26': ['09:00', '12:00', '14:00', '16:00'],
      }
    },
    {
      id: 6,
      name: 'Dr. David Kim',
      specialty: 'Psychiatrist',
      rating: 4.7,
      experience: '11 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['10:00', '12:00', '15:00', '17:00'],
        '2024-10-25': ['09:00', '11:00', '14:00', '16:00'],
        '2024-10-26': ['10:00', '13:00', '15:00', '17:00'],
      }
    },
    {
      id: 7,
      name: 'Dr. Maria Garcia',
      specialty: 'Gynecologist',
      rating: 4.9,
      experience: '16 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['08:30', '10:30', '13:30', '15:30'],
        '2024-10-25': ['09:30', '11:30', '14:30', '16:30'],
        '2024-10-26': ['08:30', '10:30', '13:30', '15:30'],
      }
    },
    {
      id: 8,
      name: 'Dr. Robert Thompson',
      specialty: 'Endocrinologist',
      rating: 4.6,
      experience: '13 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['09:00', '11:00', '14:00', '16:00'],
        '2024-10-25': ['08:00', '10:00', '13:00', '15:00'],
        '2024-10-26': ['09:00', '11:00', '14:00', '16:00'],
      }
    },
    {
      id: 9,
      name: 'Dr. Lisa Anderson',
      specialty: 'Ophthalmologist',
      rating: 4.8,
      experience: '15 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['08:00', '10:00', '13:00', '15:00'],
        '2024-10-25': ['09:00', '11:00', '14:00', '16:00'],
        '2024-10-26': ['08:00', '10:00', '13:00', '15:00'],
      }
    },
    {
      id: 10,
      name: 'Dr. Thomas Lee',
      specialty: 'Pulmonologist',
      rating: 4.7,
      experience: '12 years',
      image: 'https://via.placeholder.com/60',
      availableSlots: {
        '2024-10-24': ['09:30', '11:30', '14:30', '16:30'],
        '2024-10-25': ['08:30', '10:30', '13:30', '15:30'],
        '2024-10-26': ['09:30', '11:30', '14:30', '16:30'],
      }
    }
];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvailableSlots = () => {
    if (!selectedDoctor || !selectedDate) return [];
    return selectedDoctor.availableSlots[selectedDate] || [];
  };

  const handleBookAppointment = () => {
    setShowConfirmation(true);
    // Here you would typically make an API call to book the appointment
  };

  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.doctorCard,
        selectedDoctor?.id === item.id && styles.selectedDoctorCard
      ]}
      onPress={() => setSelectedDoctor(item)}
    >
      <View style={styles.doctorInfo}>
        <Image source={{ uri: item.image }} style={styles.doctorImage} />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          <View style={styles.doctorStats}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.doctorRating}>{item.rating}</Text>
            <Text style={styles.doctorExperience}>{item.experience}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors by name or specialty..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Doctors List */}
      <Text style={styles.sectionTitle}>Available Doctors</Text>
      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={item => item.id.toString()}
        horizontal={false}
        scrollEnabled={false}
      />

      {/* Calendar Section */}
      {selectedDoctor && (
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, marked: true, selectedColor: '#2B547E' }
            }}
            theme={{
              todayTextColor: '#2B547E',
              selectedDayBackgroundColor: '#2B547E',
            }}
          />
        </View>
      )}

      {/* Time Slots */}
      {selectedDate && selectedDoctor && (
        <View style={styles.timeSlotsSection}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.timeSlotGrid}>
            {getAvailableSlots().map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTimeSlot === slot && styles.selectedTimeSlotText
                ]}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedTimeSlot && (
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={handleBookAppointment}
            >
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="check-circle" size={60} color="#2B547E" />
            <Text style={styles.modalTitle}>Appointment Confirmed!</Text>
            <Text style={styles.modalText}>
              Your appointment has been booked with {selectedDoctor?.name} for {selectedDate} at {selectedTimeSlot}
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowConfirmation(false);
                setSelectedDoctor(null);
                setSelectedDate('');
                setSelectedTimeSlot(null);
              }}
            >
              <Text style={styles.modalButtonText}>Done</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  selectedDoctorCard: {
    borderColor: '#2B547E',
    borderWidth: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorDetails: {
    flex: 1,
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
  doctorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  doctorRating: {
    marginLeft: 4,
    marginRight: 12,
    color: '#666',
  },
  doctorExperience: {
    color: '#666',
  },
  calendarSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    elevation: 2,
  },
  timeSlotsSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  timeSlot: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  selectedTimeSlot: {
    backgroundColor: '#2B547E',
  },
  timeSlotText: {
    color: '#333',
    fontSize: 14,
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#2B547E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2B547E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentScreen;
