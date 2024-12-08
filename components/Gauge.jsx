import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNodeContext } from '../context/NodeContext';

const Gauge = ({ title, nodeUID, maxValue, size, arcColor = '#0079ED' }) => {
  // console.log(nodeUID);
  const [value, setGaugeValue] = useState(0);
  const radius = (size - 8 ) / 2;
  const strokeWidth = 20;
  const center = size / 2;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const angle = (value / maxValue) * 360;
  const offset = circumference - (angle / 360) * circumference;
  const { sensorData } = useNodeContext();
  useEffect(() => {
    try {
      if (!nodeUID || !sensorData[nodeUID]) {
        setGaugeValue(0);
        return;
      }
      setGaugeValue(sensorData[nodeUID].waterLevel);
    } catch (error) {
      console.error(`Error processing sensor data (waterLevel) for nodeUID: ${nodeUID}`, error);
      setGaugeValue(0);
    }
  }, [nodeUID, sensorData]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Svg width={size} height={size}>
        {/* Background Circle with Gradient */}
        <Defs>
          <LinearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#EEEDEB" stopOpacity="1" />
            <Stop offset="100%" stopColor="#F1F1F1" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          stroke="url(#backgroundGradient)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Foreground Circle - The Arc */}
        <Defs>
          <LinearGradient id="foregroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={arcColor} stopOpacity="1" />
            <Stop offset="100%" stopColor="#050C9C" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          stroke="url(#foregroundGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Center Text showing the percentage */}
        <SvgText
          x={center}
          y={center + 8}
          fill="#333"
          fontSize="22"
          fontWeight="bold"
          textAnchor="middle"
        >
          {`${Math.round((value / maxValue) * 100)}%`}
          {/* { console.log(value) } */}
        </SvgText>
      </Svg>
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
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.15,
    // shadowRadius: 12,
    elevation: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  }
});

export default Gauge;
