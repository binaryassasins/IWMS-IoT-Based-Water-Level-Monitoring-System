import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = '#050C9C';
  const greyColor = '#737373';

  const icons = {
    index: (props) => <AntDesign name="home" size={28} color={props.color} />,
    nodes: (props) => <MaterialIcons name="device-hub" size={28} color={props.color} />,
    settings: (props) => <Feather name="compass" size={28} color={props.color} />,
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;
        const iconColor = isFocused ? primaryColor : greyColor;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbaritem}
            onPress={onPress}
          >
            <View style={styles.iconWrapper}>
              {icons[route.name]({
                color: iconColor,
              })}
            </View>
            <Text
              style={[
                styles.tabbarLabel,
                { color: iconColor },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Ensures icons are centered horizontally
    backgroundColor: 'white',
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 8,
  },
  tabbaritem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Vertically center the items
  },
  tabbarLabel: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBar;
