import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorProfileScreen = () => {
  const quickActions = [
    { icon: '✉️', title: 'Message' },
    { icon: '🔔', title: 'Notification' },
   
  ];
  const menuItems = [
    { title: 'Basic Information', icon: 'person' },
    { title: 'Change Password', icon: 'lock' },
    { title: 'Settings', icon: 'settings' },
    { title: 'Legal Information', icon: 'description' },
    { title: 'Send Feedback', icon: 'feedback' },
    { title: 'Logout', icon: 'logout' },
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
            <Text style={styles.userName}>Dr. Joshua Fullulah</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.myAccountButton}>
          <Text style={styles.myAccountText}>My Account</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionItem}>
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
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
    backgroundColor: '#2B547E',
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
  myAccountButton: {
    backgroundColor: '#3A668B',
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
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  actionItem: {
    width: '50%',
    padding: 15,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 5,
    color: '#2B547E',
  },
  actionTitle: {
    fontSize: 14,
    color: '#4A4A4A',
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
    transition: 'background-color 0.3s ease',
  },
  menuItemHovered: {
    backgroundColor: '#f2f2f2',
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

export default DoctorProfileScreen;
git status