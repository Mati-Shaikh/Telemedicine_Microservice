import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DoctorLoginScreen = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    },
    button: {
      backgroundColor: '#005f73',
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
      color: '#005f73',
      marginTop: 15,
      textAlign: 'center',
    },
  });

  const handleLogin = async () => {
    try {
      if (credentials.email && credentials.password) {
        await AsyncStorage.setItem('doctorToken', 'dummy-token');
        navigation.replace('DoctorDashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://i.pinimg.com/474x/56/e1/66/56e1666259b6090e3e1f8df87e03259c.jpg' }}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Doctor Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email / Username"
        value={credentials.email}
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={credentials.password}
        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DoctorRegister')}>
        <Text style={styles.link}>Register as a Doctor</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DoctorLoginScreen;
