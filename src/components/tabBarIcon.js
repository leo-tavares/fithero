/* @flow */

import * as React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';

const tabBarIcon = (name: string) => ({ color }: { color: string }) => (
  <MaterialIcons style={styles.icon} name={name} color={color} size={24} />
);

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

export default tabBarIcon;
