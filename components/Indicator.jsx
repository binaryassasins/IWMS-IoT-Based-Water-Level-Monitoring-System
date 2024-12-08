import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Example icon set, you can change it
import { useNodeContext } from '../context/NodeContext';

  const Indicator = ({ title, nodeUID, size }) => {
    const [isActive, setIsActive] = useState(false);
    const activeColor = "#4CCD99";
    const inactiveColor = "#C7C8CC";
    const circleColor = isActive ? activeColor : inactiveColor;
    const stats = isActive ? "ON" : "OFF";
    
    // Adjust the arc stroke width for a thicker or thinner arc
    const arcStrokeWidth = 8; // Increase this value for a thicker arc
    const { sensorData } = useNodeContext();
    useEffect(() => {
      try {
        if (!nodeUID || !sensorData[nodeUID]) {
          setIsActive(false);
          return;
        }
        setIsActive(sensorData[nodeUID].waterPumpStatus === "on" ? true : false)      
      } catch (error) {
        console.error(`Error processing sensor data (waterPumpStatus) for nodeUID: ${nodeUID}`, error);
        setIsActive(false);
      }
    }, [nodeUID, sensorData]);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {title + " [" + stats + "]"}
        </Text>
        <View style={{ position: 'relative' }}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Gradient Background Circle */}
            <Defs>
              <LinearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={isActive ? activeColor : inactiveColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={isActive ? "#00B5A0" : "#B8B8B8"} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={(size - 8 - arcStrokeWidth) / 2} // Adjust radius for arc size
              stroke="url(#circleGradient)"
              strokeWidth={arcStrokeWidth}
              fill="none"
            />
          </Svg>
          {/* Icon with slight animation effect */}
          <Icon
            name={isActive ? "water-drop" : "water-drop"}
            size={size / 2}
            color={circleColor}
            style={[styles.icon, { opacity: isActive ? 1 : 0.6 }]} // Slightly fade out when inactive
          />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
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
      // shadowRadius: 3,
      elevation: 8,
    },
    text: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: '#333',
    },
    icon: {
      position: 'absolute',
      top: '25%', // Adjust position to center the icon
      left: '25%',
      transform: [{ scale: 1.2 }], // Slightly enlarge the icon for a more dynamic look
    },
  });

  export default Indicator;
