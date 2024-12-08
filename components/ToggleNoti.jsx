import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';  // Import expo-notifications

const ToggleNoti = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // Check for notification permission status on component mount
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        setIsNotificationsEnabled(true);  // If permission granted, enable notifications
      } else {
        setIsNotificationsEnabled(false);  // If not granted, disable notifications
      }
    };

    checkPermission();
  }, []);

  // Function to handle switch toggle
  const handleToggle = async (value) => {
    if (value) {
      // Request permission to send notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setIsNotificationsEnabled(true);
        Alert.alert('Notifications Enabled', 'Notifications have been enabled.');
      } else {
        setIsNotificationsEnabled(false);
        Alert.alert('Notification Permission Denied', 'Notifications permission denied.');
      }
    } else {
      setIsNotificationsEnabled(false);
      Alert.alert('Notifications Disabled', 'Notifications have been disabled.');
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.switchContainer}>
        <Text style={styles.optionText}>Enable Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={handleToggle}
          thumbColor={isNotificationsEnabled ? '#fff' : '#006769'}
          trackColor={{ false: '#ccc', true: '#050C9C' }}
          style={styles.switch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 5,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    // shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 10,
    elevation: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Slightly enlarge the switch for better UX
  },
});

export default ToggleNoti;
