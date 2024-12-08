import { StyleSheet } from 'react-native';

const FlexBox = StyleSheet.create({
  container: {
    flex: 1,                   // Take full space available
    padding: 5,
    alignItems: 'center',      // Center items horizontally
    //backgroundColor: 'red',    // Background color
    // marginTop: 0,
  },
  row: {
    //backgroundColor: '#d3d3d3',
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute items evenly
    alignItems: 'center',            // Align items vertically
    //marginVertical: 8,
  },
  col: {
    flex: 1,  // Default to fill equally
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 50,
  },
  colHalf: {
    flex: 0.5, // Takes half the available width
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  colDouble: {
    flex: 2, // Takes twice the available width
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  item: {
    flexShrink: 2,
  },
});

export default FlexBox;
