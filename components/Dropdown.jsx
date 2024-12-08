import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNodeContext } from '../context/NodeContext';
import Icon from 'react-native-vector-icons/FontAwesome';  // Import icon library

const Dropdown = ({ onSelectNode }) => {
  const { nodes } = useNodeContext(); // Get nodes from context
  const [selectedNode, setSelectedNode] = useState(nodes[0]?.id); // Default to first node (if available)

  // Handle node selection from the dropdown
  const handleNodeChange = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId); // Find the node object by id
    setSelectedNode(nodeId); // Set selected node id
    onSelectNode(node); // Pass the selected node to the parent component
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Display Node</Text>
      
      {/* Conditional rendering for dropdown */}
      {nodes.length === 0 ? (
        // When there are no nodes, display an option to add a node
        <TouchableOpacity 
          style={styles.pickerContainer} 
          disabled={true}
        >
          <Text style={styles.placeholderText}>Navigate to Nodes to add a node</Text>
        </TouchableOpacity>
      ) : (
        // When there are nodes, display the picker dropdown
        <TouchableOpacity style={styles.pickerContainer} activeOpacity={1}>
          <Picker
            selectedValue={selectedNode}
            onValueChange={handleNodeChange}
            style={styles.picker}
            mode="dropdown" // 'dropdown' mode for better UI on iOS
          >
            {nodes.map((node) => (
              <Picker.Item key={node.id} label={node.name} value={node.id} />
            ))}
          </Picker>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,  // For Android shadow effect
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'relative', // Position the icon inside the picker container
  },
  picker: {
    height: 50,
    width: '100%',
    fontSize: 16,
    color: '#333',
    paddingRight: 25, // Space for the icon
  },
  placeholderText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});

export default Dropdown;
