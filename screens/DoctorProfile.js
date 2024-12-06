import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user profile from API
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('http://192.168.18.25:3001/auth/fetchProfile', {
        method: 'GET',
        headers: {
        token:token
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

  // Logout functionality
  const handleLogout = async () => {
    try {

      Alert.alert('Logout', 'You have been logged out.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Failed to logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
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
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.profileImage}
          />
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
            onPress={item.onPress ? item.onPress : () => {}}
          >
            <View style={styles.menuItemContent}>
              <Icon name={item.icon} size={24} color="#4A4A4A" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#4A4A4A" />
          </TouchableOpacity>
        ))}
      </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
});

export default ProfileScreen;