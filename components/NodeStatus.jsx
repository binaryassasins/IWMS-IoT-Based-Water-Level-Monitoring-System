import { View } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { useNodeContext } from '../context/NodeContext';

const NodeStatus = ({ nodeUID }) => {
  const { nodeStatuses } = useNodeContext();
  const isOnline = nodeStatuses[nodeUID] || false;

  const onlineColor = "#4CCD99";
  const offlineColor = "#FF0F0F";
  const dotColor = isOnline ? onlineColor : offlineColor;

  return (
    <View>
      <Entypo name="signal" size={30} color={dotColor} />
    </View>
  );
};

export default NodeStatus;
