import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../components/TabBar';
import SplashScreen from '../components/SplashScreen';  // Import the splash screen component
import { NodeProvider } from '../context/NodeContext';

const _layout = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Simulate splash screen visibility for 3 seconds
    const timer = setTimeout(() => {
      setIsSplashVisible(false);  // Hide the splash screen after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);  // Cleanup timer on component unmount
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <NodeProvider>
      <Tabs tabBar={props => <TabBar {...props} />}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="nodes"
          options={{
            title: "Nodes",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
    </NodeProvider>
  );
};

export default _layout;
