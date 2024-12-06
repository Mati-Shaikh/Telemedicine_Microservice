import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorProfile = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('');

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.18.25:3001/auth/fetchProfile', {
        method: 'GET',
        headers: { token },
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.name || 'Unknown User');
        setUserRole(data.role || 'Unknown Role');
      } else {
        Alert.alert('Error', 'Failed to fetch profile. Please try again.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      Alert.alert('Error', 'An error occurred while fetching profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Failed to logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleMenuPress = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    switch (selectedMenu) {
      case 'basic Information':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Basic Information</Text>
            <Text style={styles.modalText}>Name: {userName}</Text>
            <Text style={styles.modalText}>Role: {userRole}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Change Password':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => Alert.alert('Password changed successfully!')}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const menuItems = [
    { title: 'basic Information', icon: 'person' },
    { title: 'Change Password', icon: 'lock' },
    { title: 'Settings', icon: 'settings' },
    { title: 'Legal Information', icon: 'description' },
    { title: 'Logout', icon: 'logout', onPress: handleLogout },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.initialsContainer}>
            <Text style={styles.initialsText}>
              {loading ? '?' : getInitials(userName)}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.userName}>
              {loading ? 'Loading...' : userName}
            </Text>
            <Text style={styles.userRole}>
              {loading ? 'Loading...' : userRole}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.myAccountButton}>
          <Text style={styles.myAccountText}>My Account</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => (item.onPress ? item.onPress() : handleMenuPress(item.title))}
          >
            <View style={styles.menuItemContent}>
              <Icon name={item.icon} size={24} color="#4A4A4A" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#4A4A4A" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>{renderModalContent()}</View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#008080',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialsContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
  },
  headerText: {
    marginLeft: 15,
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userRole: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  myAccountButton: {
    backgroundColor: '#008080',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-end',
    marginTop: 15,
  },
  myAccountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#4A4A4A',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default DoctorProfile;