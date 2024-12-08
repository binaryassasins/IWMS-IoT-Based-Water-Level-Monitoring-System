import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NodeList from '../components/NodeList';
import FAB from '../components/FAB';
import CustomModal from '../components/CustomModal';
import DeleteModal from '../components/DeleteModal';
import Row from '../components/Row';
import Col from '../components/Col';
import FlexBox from '../components/FlexBox';
import Log from '../components/Log';
import { useNodeContext } from '../context/NodeContext';

const Nodes = () => {
  const navigation = useNavigation();
  const { nodes, addNode, editNode, removeNode, sensorData } = useNodeContext();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for DeleteModal
  const [logs, setLogs] = useState([]);
  const [leakageTracker, setLeakageTracker] = useState({});
  const fadeAnim = new Animated.Value(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: 'Nodes',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
      headerRight: () => <Log logs={logs} bellIconStyle={{ marginRight: 25 }} />,
      headerStyle: {
        height: 90,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (!nodes.length || !Object.keys(sensorData).length) return;

    nodes.forEach((node) => {
      const nodeData = sensorData[node.nodeUID];
      if (!nodeData) return;

      const isLeak = nodeData.leakageStatus;

      if (isLeak && !leakageTracker[node.nodeUID]) {
        const newLog = {
          timestamp: new Date().toLocaleString(),
          event: `Leak detected at Node ${node.nodeUID}`,
        };
        setLogs((prevLogs) => [newLog, ...prevLogs]);

        setLeakageTracker((prevTracker) => ({
          ...prevTracker,
          [node.nodeUID]: true,
        }));
      }

      if (!isLeak && leakageTracker[node.nodeUID]) {
        setLeakageTracker((prevTracker) => ({
          ...prevTracker,
          [node.nodeUID]: false,
        }));
      }
    });
  }, [nodes, sensorData, leakageTracker]);

  // Handle node click to show configuration modal
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowConfig(true);
  };

  // Handle node delete
  const handleNodeDelete = () => {
    if (selectedNode) {
      console.log("Removing node:", selectedNode);
      removeNode(selectedNode.id); // Remove node using context
      setShowDeleteModal(false); // Close the modal
      setSelectedNode(null); // Reset selected node
    } else {
      console.error("No node selected for deletion");
    }
  };

  // Trigger DeleteModal
  const handleDeleteTrigger = (node) => {
    console.log("Trigger delete for node:", node); // Debug log
    setSelectedNode(node);
    setShowDeleteModal(true);
  };

  return (
    <View style={FlexBox.container}>
      <Row>
        <Col size="double">
          {/* Node List Component */}
          <NodeList
            nodes={nodes}
            onPressNode={handleNodeClick}
            onRemoveNode={handleDeleteTrigger} // Pass function to trigger DeleteModal
          />
        </Col>
      </Row>

      {/* Floating Add Button */}
      <FAB onPress={() => setShowAddModal(true)} />

      {/* Modal for Adding Node */}
      <CustomModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddNode={addNode}
      />

      {/* Modal for Editing Node */}
      <CustomModal
        visible={showConfig}
        onClose={() => setShowConfig(false)}
        selectedNode={selectedNode}
        onEditNode={editNode}
      />

      {/* Delete Modal */}
      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleNodeDelete}
        nodeName={selectedNode ? selectedNode.nodeUID : ''}
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.fadeText}>New Node Added!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fadeText: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Nodes;
