import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { useNodeContext } from '../context/NodeContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'Please enable notifications in settings.');
  }
};

const LCDDisplay = ({ title, nodeUID }) => {
  const [isLeak, setIsLeak] = useState(false);
  const alertColor = "#EB5B00"
  const textColor = "#131842"
  const displayText = isLeak ? "Leak Detected!" : "No Leak Detected.";
  const { sensorData } = useNodeContext();
  useEffect(() => {
    requestNotificationPermissions();
    if (isLeak) {
      sendLeakNotification();
    }
  }, [isLeak]);

  useEffect(() => {
    try {
      if (!nodeUID || !sensorData[nodeUID]) {
        setIsLeak(false);
        return;
      }
      setIsLeak(sensorData[nodeUID].leakageStatus === true ? true : false);
    } catch (error) {
      console.error(`Error processing sensor data (leakageStatus) for nodeUID: ${nodeUID}`, error);
      setIsLeak(false);
    }
  }, [nodeUID, sensorData]);

  const sendLeakNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Leak Alert 🚨',
          body: 'A leak has been detected!',      
        },
        trigger: null, // Send immediately
      })
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={[styles.displayText, {color: isLeak ? alertColor : textColor}]}>
        {displayText}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // shadowColor: 'black',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 1,
    elevation: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  displayText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  }
})

export default LCDDisplay;