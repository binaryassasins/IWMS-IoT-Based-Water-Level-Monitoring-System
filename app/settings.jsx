import { View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ToggleNoti from '../components/ToggleNoti';
import FlexBox from '../components/FlexBox';
import Row from '../components/Row';
import Col from '../components/Col';

const Settings = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center', // Center the title
      title: 'Settings',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
      headerStyle: {
        height: 90,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
      },
    });
  }, [navigation]);

  return (
    <View style={FlexBox.container}>
      <Row>
        <Col size='double'>
          <ToggleNoti />
        </Col>
      </Row>
    </View>
  );
};

export default Settings;
