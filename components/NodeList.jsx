import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MiniGauge from './MiniGauge';
import { useNodeContext } from '../context/NodeContext';
import NodeStatus from './NodeStatus';

const NodeList = ({ nodes, onPressNode, onRemoveNode }) => {
  const { sensorData } = useNodeContext();  // Access sensor data from context

  return (
    <View style={styles.container}>
      {nodes.map((node) => {
        const nodeData = sensorData[node.nodeUID] || {};  // Get sensor data for each node

        return (
          <View key={node.id} style={styles.nodeItem}>
            <TouchableOpacity onPress={() => onPressNode(node)} style={styles.nodeTextContainer}>
              <NodeStatus nodeUID={nodeData.nodeUID}/>
              <View style={styles.nodeTextAlignment}>
                <Text style={styles.nodeText}>{node.name}</Text>
                <Text style={styles.nodeText2}>{node.nodeUID}</Text>
              </View>
              {/* Pass the fetched water level to MiniGauge */}
              <MiniGauge value={nodeData.waterLevel || 0} maxValue={100} />
            </TouchableOpacity>

            {/* Remove the restriction for the default node */}
            <TouchableOpacity onPress={() => onRemoveNode(node)}>
              <MaterialIcons 
                name="delete" 
                size={30} 
                color="red" 
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
  },
  nodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: 'white',
    paddingVertical: 10,
    elevation: 8,
  },
  nodeTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  nodeText2: {
    fontSize: 13,
  },
  nodeTextAlignment: {
    flexDirection: 'column',
  }
});

export default NodeList;
