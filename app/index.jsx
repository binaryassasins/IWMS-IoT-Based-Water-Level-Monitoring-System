import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Gauge from '../components/Gauge';
import FlexBox from '../components/FlexBox';
import Row from '../components/Row';
import Col from '../components/Col';
import Indicator from '../components/Indicator';
import LCDDisplay from '../components/LCDDisplay';
import Chart from '../components/Chart';
import Log from '../components/Log';
import Dropdown from '../components/Dropdown';
import { useNodeContext } from '../context/NodeContext';

const { width: screenWidth } = Dimensions.get('window');
const gaugeSize = screenWidth * 0.35;
const ledSize = screenWidth * 0.35;

const Home = () => {  
  const navigation = useNavigation();
  const { nodes, sensorData } = useNodeContext();  // Access nodes and sensor data from context
  const [selectedNode, setSelectedNode] = useState(nodes[0] || {});  // Default to first node
  // const [gaugeValue, setGaugeValue] = useState(0);
  // const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState([]); // Dynamic logs state
  const [leakageTracker, setLeakageTracker] = useState({}); // Track active leaks per node

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: 'Home',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
      headerRight: () => <Log logs={logs} bellIconStyle={{ marginRight: 25 }} />, // Pass dynamic logs
      headerStyle: {
        height: 90,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
      },
    });
  }, [navigation, logs]); // Add logs as dependency

  // Monitor sensor data for all nodes
  useEffect(() => {
    if (!nodes.length || !Object.keys(sensorData).length) return;

    nodes.forEach((node) => {
      const nodeData = sensorData[node.nodeUID];
      if (!nodeData) return;

      const isLeak = nodeData.leakageStatus;
      
      // Check if this node's leakageStatus is already logged
      if (isLeak && !leakageTracker[node.nodeUID]) {
        const newLog = {
          timestamp: new Date().toLocaleString(), // Current date and time
          event: `Leak detected at Node ${node.nodeUID}`,
        };
        setLogs((prevLogs) => [newLog, ...prevLogs]); // Add new log to the top

        // Update leakage tracker
        setLeakageTracker((prevTracker) => ({
          ...prevTracker,
          [node.nodeUID]: true, // Mark this node as leaking
        }));
      }

      // Clear the leakage tracker if leak stops
      if (!isLeak && leakageTracker[node.nodeUID]) {
        setLeakageTracker((prevTracker) => ({
          ...prevTracker,
          [node.nodeUID]: false, // Mark this node as no longer leaking
        }));
      }
    });
  }, [nodes, sensorData, leakageTracker]); // Watch for changes in sensorData and nodes

  // useEffect(() => {
  //   if (selectedNode && sensorData[selectedNode.nodeUID]) {
  //     const nodeData = sensorData[selectedNode.nodeUID];
  //     setGaugeValue(nodeData.waterLevel || 0);
  //     setIsActive(nodeData.waterPumpStatus === 'on');
  //   }
  // }, [selectedNode, sensorData]);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
      <View style={FlexBox.container}>
        <Row>
          <Col size='double'>
            <Dropdown nodes={nodes} onSelectNode={handleNodeSelect} />
          </Col>
        </Row>
        <Row>
          <Col size='half'>
            <Gauge title="Water Level" nodeUID={selectedNode?.nodeUID} maxValue={100} size={gaugeSize}/>
          </Col>
          <Col size='half'>
            <Indicator title="Water Pump" nodeUID={selectedNode?.nodeUID} size={ledSize}/>
          </Col>
        </Row>
        <Row>
          <Col size='double'>
            <LCDDisplay title="Micro Leak Detection" nodeUID={selectedNode?.nodeUID} />
          </Col>
        </Row>
        <Row>
          <Col size='double'>
            <Chart title="Water Level Summary" nodeUID={selectedNode?.nodeUID}/>
          </Col>
        </Row>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Ensure ScrollView takes full screen height
  },
});

export default Home;
