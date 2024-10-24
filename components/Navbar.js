import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Image
        //source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Ionicons name="person-circle" size={32} color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  logo: {
    width: 150,
    height: 40,
  },
});

export default Navbar;