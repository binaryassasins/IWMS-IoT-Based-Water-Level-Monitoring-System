import React, { useState, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, Animated, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNodeContext } from '../context/NodeContext';

const Log = ({ bellIconStyle }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade effect
  const { nodes, sensorData } = useNodeContext(); // Access nodes and sensor data from context
  const [logs, setLogs] = useState([]); // State to store all logs
  const [leakageTracker, setLeakageTracker] = useState({}); // Track leaks for each node

  // Update logs based on sensor data
  useEffect(() => {
    if (!nodes.length || !Object.keys(sensorData).length) return;

    nodes.forEach((node) => {
      const nodeData = sensorData[node.nodeUID];
      if (!nodeData) return;

      const isLeak = nodeData.leakageStatus;

      // Log new leaks
      if (isLeak && !leakageTracker[node.nodeUID]) {
        const newLog = {
          timestamp: new Date().toLocaleString(),
          event: `Leak detected at Node ${node.nodeUID}`,
        };
        setLogs((prevLogs) => [newLog, ...prevLogs]); // Add to logs
        setLeakageTracker((prevTracker) => ({
          ...prevTracker,
          [node.nodeUID]: true,
        }));
      }

      // Clear the tracker if the leak stops
      if (!isLeak && leakageTracker[node.nodeUID]) {
        setLeakageTracker((prevTracker) => ({
          ...prevTracker,
          [node.nodeUID]: false,
        }));
      }
    });
  }, [nodes, sensorData, leakageTracker]);

  const handleOpenModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <>
      {/* Bell Icon */}
      <TouchableOpacity
        style={[styles.bellIcon, bellIconStyle]}
        onPress={handleOpenModal}
      >
        <Feather name="bell" size={24} color="black" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <Text style={styles.modalTitle}>Node Event History</Text>
              {logs.length > 0 ? (
                <FlatList
                  data={logs}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.logItem}>
                      <Text style={styles.logTimestamp}>{item.timestamp}</Text>
                      <Text style={styles.logEvent}>{item.event}</Text>
                    </View>
                  )}
                />
              ) : (
                <Text style={styles.noEventsText}>
                  There are no leaking events at the moment.
                </Text>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bellIcon: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  logItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  logTimestamp: {
    fontSize: 14,
    color: '#666',
  },
  logEvent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noEventsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#050C9C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Log;
