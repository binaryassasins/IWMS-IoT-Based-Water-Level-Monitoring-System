import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback 
} from 'react-native';
import axios from 'axios';

const CustomModal = ({ visible, onClose, onAddNode, onEditNode, selectedNode }) => {
  const [nodeName, setNodeName] = useState('');
  const [nodeUID, setNodeUID] = useState('');
  const [error, setError] = useState(''); // Error state for invalid nodeUID
  // Populate modal fields if editing a node
  useEffect(() => {
    if (selectedNode) {
      setNodeName(selectedNode.name);
      setNodeUID(selectedNode.nodeUID || '');
    } else {
      setNodeName('');
      setNodeUID('');
      setError('');
    }
  }, [selectedNode]);

  const handleSave = async () => {
    if (!nodeUID) {
      setError('Please enter a nodeUID');
      return;
    }

    try {
      // Verify nodeUID with the server
      const response = await axios.get(`http://52.77.241.224:3000/sensor-data/${nodeUID}`);
      if (response.status === 200) {
        // Proceed with adding or editing the node
        if (selectedNode && onEditNode) {
          const updatedNode = { id: selectedNode.id, name: nodeName, nodeUID };
          onEditNode(updatedNode);
        } else if (onAddNode) {
          const newNode = { name: nodeName, nodeUID };
          onAddNode(newNode);
        }
        onClose();
      }
    } catch (error) {
      setError('Invalid nodeUID. Please check the UID and try again.');
    }
  };

  // Reset error when valid nodeUID is entered
  useEffect(() => {
    if (nodeUID && !error) {
      setError('');
    }
  }, [nodeUID]);

  // Reset the form when adding a new node; retain inputs when editing
  const handleCancel = () => {
    if (!selectedNode) {
      setNodeName('');
      setNodeUID('');
      setError('');
    }
    onClose();
  };
  // Input masking
  const handleNodeUIDChange = (text) => {
    // Remove non-alphanumeric characters and convert to uppercase
    let cleanedText = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
    // Ensure 'v' is always lowercase in the appropriate position
    if (cleanedText.length > 3) {
      cleanedText = cleanedText.slice(0, 3) + 'v' + cleanedText.slice(4);
    }
  
    // Format the text
    let formattedText = cleanedText;
    if (cleanedText.length > 5) {
      formattedText = cleanedText.slice(0, 5) + '-' + cleanedText.slice(5);
    }
    if (formattedText.length > 12) {
      formattedText = formattedText.slice(0, 12) + '-' + formattedText.slice(12);
    }
  
    // Set the formatted text
    setNodeUID(formattedText);
  };  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlayContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedNode ? 'Edit Node' : 'Add New Node'}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Node Name (eg. Main Tank)"
                value={nodeName}
                onChangeText={setNodeName}
                style={styles.input}
              />
              <TextInput
                placeholder="NSN (eg. NDEv1-ABC123-DEF456)"
                value={nodeUID}
                onChangeText={handleNodeUIDChange}
                style={styles.input} // No restriction for default node
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#050C9C' }]} onPress={handleSave}>
                <Text style={styles.buttonText}>{selectedNode ? "Save Changes" : "Add Node"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#050C9C',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomModal;
