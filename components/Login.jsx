import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import axios from 'axios';  // Assuming you'll use axios to communicate with the backend API

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Replace with your backend API login endpoint
      const response = await axios.post('http://52.77.241.224:3000/login', {
        username,
        password
      });
  
      console.log('Login response:', response.data); // Log the response data
  
      if (response.data.success) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.token);
  
        // Verify if the token is successfully stored
        const token = await AsyncStorage.getItem('authToken');
        console.log('Token stored in AsyncStorage:', token);  // Check token stored in AsyncStorage
  
        // Check if the token is correctly retrieved
        if (token) {
          console.log('Token successfully stored and retrieved:', token);
        } else {
          console.error('Token not found in AsyncStorage');
        }
  
        // Redirect to the homepage (index.jsx)
        navigation.replace('index');  // Use navigation.replace to avoid navigating back to login
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Login;
