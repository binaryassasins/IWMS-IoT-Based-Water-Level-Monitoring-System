import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const Chart = ({ title, nodeUID }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);
  
  const { width } = Dimensions.get("window"); // Dynamic width based on screen size

  // Helper function to get today's date (without time part)
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  useEffect(() => {
    // Only fetch data if nodeUID is present (i.e., a node is selected)
    if (!nodeUID) {
      setLoading(false);
      setNoData(true);  // Indicate that there's no node to display data for
      return;
    }

    const fetchData = async () => {
      const todayDate = getTodayDate();
      try {
        const response = await axios.get(`http://52.77.241.224:3000/sensor-data/${nodeUID}`);

        if (response && Array.isArray(response.data)) {
          const reversedData = response.data.reverse();
          const filteredData = reversedData.filter((item) => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= todayDate;
          });

          const labels = filteredData.map((item) => {
            const date = new Date(item.timestamp);
            return date.toLocaleTimeString("en-US", {
              timeZone: "Asia/Kuala_Lumpur",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            });
          });
          const dataPoints = filteredData.map((item) => item.waterLevel);

          if (labels.length && dataPoints.length) {
            setChartData({
              labels,
              datasets: [{
                data: dataPoints,
                color: (opacity = 1) => `rgba(39, 2, 188, ${opacity})`,
                strokeWidth: 2,
              }],
              legend: ["Water Level"],
            });
            setNoData(false); // Data found
          } else {
            setNoData(true); // No data
            setChartData({ labels: [], datasets: [] });
          }
        } else {
          throw new Error("Invalid server response");
        }
      } catch (error) {
        console.error("Error fetching data chart:", error.message);
        setError(error.message || "An error occurred");
        setChartData({
          labels: ["Error"],
          datasets: [{
            data: [0],
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            strokeWidth: 2,
          }],
          legend: ["Error"],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(intervalId); // Clean up interval
  }, [nodeUID]); // Re-run when nodeUID changes

  // Loading or Error states
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If no data for today, show message
  if (noData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noDataText}>No data recorded for the selected node today</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartWrapper}>
          <LineChart
            data={chartData}
            width={Math.max(width, chartData.labels.length * 80 + 80)} // Dynamic width
            height={180}
            yAxisLabel=""
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(39, 2, 188, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(39, 2, 188, ${opacity})`,
              style: {
                borderRadius: 16,
                paddingRight: 40,
              },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "rgba(39, 2, 188, 0.7)",
                fill: "rgba(39, 2, 188, 0.7)",
              },
            }}
            bezier
            style={styles.chartStyle}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  chartWrapper: {
    width: '100%',
    backgroundColor: '#ffffff',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  chartStyle: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },
});

export default Chart;
