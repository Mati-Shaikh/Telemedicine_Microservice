import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this package

const ProfileScreen = () => {
  const healthMetrics = [
    { icon: '🌡️', title: '56', subtitle: 'Heart Rate' },
    { icon: '💧', title: '120/80', subtitle: 'Blood Pressure' },
    { icon: '📏', title: "5", subtitle: 'Height' },
    { icon: '⚖️', title: '135', subtitle: 'Weight' },
    { icon: '❤️', title: '125', subtitle: 'Pulse Rate' },
    { icon: '🔥', title: '135', subtitle: 'Calories' },
  ];

  const quickActions = [
    { icon: '✉️', title: 'Message' },
    { icon: '🔔', title: 'Notification' },
    { icon: '💊', title: 'Pills Reminder' },
    { icon: '📝', title: 'Our Blogs' },
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
            <Text style={styles.userName}>Joshua Fullulah</Text>
            <Text style={styles.userLocation}>Bennettsville, TX</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.myAccountButton}>
          <Text style={styles.myAccountText}>My Account</Text>
        </TouchableOpacity>
      </View>

      {/* Health Metrics Grid */}
      <View style={styles.metricsContainer}>
        {healthMetrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <Text style={styles.metricIcon}>{metric.icon}</Text>
            <Text style={styles.metricValue}>{metric.title}</Text>
            <Text style={styles.metricLabel}>{metric.subtitle}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions Grid */}
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerText: {
    marginLeft: 15,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userLocation: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  myAccountButton: {
    backgroundColor: '#3A668B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  myAccountText: {
    color: 'white',
    fontSize: 14,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  metricItem: {
    width: '33.33%',
    padding: 10,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  metricLabel: {
    fontSize: 12,
    color: '#757575',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  actionItem: {
    width: '50%',
    padding: 15,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionTitle: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
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
});

export default ProfileScreen;