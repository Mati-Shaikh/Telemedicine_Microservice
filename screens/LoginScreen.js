import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

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
      flexDirection: 'row',
      justifyContent: 'center',
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
    loader: {
      marginLeft: 10,
    },
  });

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.18.25:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: credentials.email,
          Password: credentials.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);

        // Decode the token to extract the role
        const tokenParts = data.token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log(payload);
          const userRole = payload.role; // Ensure the payload contains 'userRole'
          console.log(userRole);

          if (userRole === 'Doctor') {
            Alert.alert('Success Doctor', `Welcome, ${data.user.FullName}`, [
              { text: 'OK', onPress: () => navigation.navigate('MainAppDoctor') },
            ]);
          } else {
            Alert.alert('Success Patient', `Welcome, ${data.user.FullName}`, [
              { text: 'OK', onPress: () => navigation.navigate('MainApp') },
            ]);
          }
        } else {
          Alert.alert('Error', 'Invalid token format');
        }
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://i.pinimg.com/474x/56/e1/66/56e1666259b6090e3e1f8df87e03259c.jpg',
          }}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="EMAIL / MOBILE NUMBER"
        value={credentials.email}
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        secureTextEntry
        value={credentials.password}
        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
        {loading && <ActivityIndicator color="#fff" style={styles.loader} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register new account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;