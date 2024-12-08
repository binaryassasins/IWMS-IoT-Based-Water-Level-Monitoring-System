import { View, Text } from 'react-native'
import React from 'react'
import FlexBox from './FlexBox'

const Col = ({ size = 'full', children, style }) => {
  let colStyle = FlexBox.col;
  if (size === 'half') colStyle = FlexBox.colHalf;
  if (size === 'double') colStyle = FlexBox.colDouble;
  return (
    <View style={[colStyle, style]}>
      {children}
    </View>
  )
}

export default Col;