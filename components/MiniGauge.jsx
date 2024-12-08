import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const MiniGauge = ({ value, maxValue }) => {
  const size = 60; // Mini gauge size
  const radius = size / 2;
  const strokeWidth = 8; // Adjust stroke width for the mini gauge
  const center = size / 2;
  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
  const angle = (value / maxValue) * 360;
  const offset = circumference - (angle / 360) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          stroke="#EEEDEB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          stroke="#050C9C" // Arc color
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <SvgText
          x={center}
          y={center+5}
          fill="#333"
          fontSize="12" // Smaller font size for mini gauge
          fontWeight="bold"
          textAnchor="middle"
        >
          {`${Math.round((value / maxValue) * 100)}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Add margin if needed for spacing
  },
});

export default MiniGauge;
