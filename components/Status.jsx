import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Status = ({ title, status }) => {
  const alertColor = "#EB5B00"
  const textColor = "#131842"
  const displayText = status ? "Online" : "Offline";
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={[styles.displayText, {color: status ? alertColor : textColor}]}>
        {displayText}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    //elevation: 1,  // Add shadow effect for better UI
    // shadowColor: 'black',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 1,
    elevation: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  displayText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  }
})

export default Status