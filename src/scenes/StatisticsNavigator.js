/* @flow */

import * as React from 'react';
import { useTheme } from 'react-native-paper';

import { createStackNavigator } from '@react-navigation/stack';
import i18n from '../utils/i18n';
import StatisticsScreen from './Statistics';
import { getDefaultNavigationOptions } from '../utils/navigation';
import type { ThemeType } from '../utils/theme/withTheme';

const Stack = createStackNavigator();

const StatisticsNavigator = () => {
  const theme: ThemeType = useTheme();

  return (
    <Stack.Navigator screenOptions={getDefaultNavigationOptions(theme)}>
      <Stack.Screen
        name="Statistics"
        options={{ title: i18n.t('menu__statistics') }}
        component={StatisticsScreen}
      />
    </Stack.Navigator>
  );
};

export default StatisticsNavigator;
