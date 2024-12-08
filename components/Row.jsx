import { View, Text } from 'react-native'
import React from 'react'
import FlexBox from './FlexBox';

const Row = ({ children, style }) => {
  return (
    <View style={[FlexBox.row, style]}>
      {children}
    </View>
  )
}

export default Row;