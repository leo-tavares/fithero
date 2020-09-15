/* @flow */

import { Platform } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';

import type { ThemeType } from './theme/withTheme';

export const getDefaultNavigationOptions = (theme: ThemeType) => ({
  title: 'FitHero',
  headerStyle: {
    elevation: 0,
    backgroundColor: theme.colors.toolbar,
    borderBottomColor: theme.colors.toolbar,
  },
  headerTintColor: theme.colors.toolbarTint,
  headerPressColorAndroid: 'rgba(255, 255, 255, .20)',
  cardStyle: {
    backgroundColor: theme.colors.background,
  },
  ...(Platform.OS === 'android'
    ? // TODO Check ScaleFromCenterAndroid if can't make native stack to work
      TransitionPresets.FadeFromBottomAndroid
    : undefined),
});
