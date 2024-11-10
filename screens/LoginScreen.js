import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
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
      backgroundColor: '#008080',
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
      color: '#008080',
      marginTop: 15,
      textAlign: 'center',
    },
  });

  const handleLogin = async () => {
    try {
      const response = await fetch('https://dummyapi.io/data/v1/user', {
        headers: {
          'app-id': 'YOUR_DUMMY_API_KEY',
        },
      });
      const data = await response.json();
      
      
      if (credentials.email && credentials.password) {
        await AsyncStorage.setItem('userToken', 'dummy-token');
        navigation.replace('MainApp');
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

      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="EMAIL / MOBILE NUMBER"
        value={credentials.email}
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        secureTextEntry
        value={credentials.password}
        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register new account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;