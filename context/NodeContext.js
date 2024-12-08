import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NodeContext = createContext();

export const NodeProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [nodeStatuses, setNodeStatuses] = useState({});

  // Fetch nodes from AsyncStorage on mount
  useEffect(() => {
    const loadNodes = async () => {
      try {
        const storedNodes = await AsyncStorage.getItem('nodes');
        if (storedNodes) {
          setNodes(JSON.parse(storedNodes));
        }
      } catch (error) {
        console.error('Error loading nodes:', error);
      }
    };
    loadNodes();
  }, []);

  // Fetch sensor data for nodes
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        for (const node of nodes) {
          const response = await axios.get(`http://52.77.241.224:3000/sensor-data/latest/${node.nodeUID}`);
          if (response.status === 200) {
            setSensorData(prevData => ({
              ...prevData,
              [node.nodeUID]: response.data
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    if (nodes.length) {
      fetchSensorData();
    }

    const intervalId = setInterval(fetchSensorData, 2000);
    return () => clearInterval(intervalId);
  }, [nodes]);

  // Fetch node statuses
  useEffect(() => {
    const fetchNodeStatuses = async () => {
      try {
        const updatedStatuses = {};
        for (const node of nodes) {
          const response = await axios.get(`http://52.77.241.224:3000/node-status/${node.nodeUID}`);
          updatedStatuses[node.nodeUID] = response.data.nodeStatus === 'online';
        }
        setNodeStatuses(updatedStatuses);
      } catch (error) {
        console.error('Error fetching node statuses:', error);
      }
    };

    if (nodes.length) {
      fetchNodeStatuses();
    }

    const intervalId = setInterval(fetchNodeStatuses, 2000);
    return () => clearInterval(intervalId);
  }, [nodes]);

  const addNode = async (newNode) => {
    const updatedNodes = [...nodes, { ...newNode, id: `${nodes.length + 1}` }];
    setNodes(updatedNodes);
    try {
      await AsyncStorage.setItem('nodes', JSON.stringify(updatedNodes));
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  const editNode = async (editedNode) => {
    const updatedNodes = nodes.map(node => node.id === editedNode.id ? editedNode : node);
    setNodes(updatedNodes);
    try {
      await AsyncStorage.setItem('nodes', JSON.stringify(updatedNodes));
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  const removeNode = async (nodeId) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    console.log("Nodes after deletion:", updatedNodes);
    const nodeToRemove = nodes.find(node => node.id === nodeId);

    setNodes(updatedNodes);

    if (nodeToRemove) {
      setSensorData(prevData => {
        const updatedSensorData = { ...prevData };
        delete updatedSensorData[nodeToRemove.nodeUID];
        return updatedSensorData;
      });
      setNodeStatuses(prevStatuses => {
        const updatedStatuses = { ...prevStatuses };
        delete updatedStatuses[nodeToRemove.nodeUID];
        return updatedStatuses;
      });
    }

    try {
      await AsyncStorage.setItem('nodes', JSON.stringify(updatedNodes));
      console.log("AsyncStorage updated after deletion.");
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  return (
    <NodeContext.Provider
      value={{
        nodes,
        sensorData,
        nodeStatuses,
        addNode,
        editNode,
        removeNode,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};

export const useNodeContext = () => {
  return useContext(NodeContext);
};
