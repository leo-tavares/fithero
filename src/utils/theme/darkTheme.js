/* @flow */

import { Platform } from 'react-native';
import { Colors, DarkTheme as PaperDarkTheme } from 'react-native-paper';

import type { ThemeColorsType } from './types';
import type { ThemeType } from './withTheme';
import { isIOS13 } from '../constants';

const accent = '#a6ed8e';
const background = PaperDarkTheme.colors.background;
const surface = PaperDarkTheme.colors.surface;
const selected = '#474747';

const ThemeColors: ThemeColorsType = {
  accent,
  background,
  borderColor: '#555555',
  calendarSelectedDayTextColor: background,
  calendarSelectedDotColor: background,
  chartBar: Colors.green200,
  chip: '#2e2e2e',
  chipSelected: selected,
  dialogBackground: surface,
  secondaryText: '#a0a0a0',
  selected,
  surface,
  primary: background,
  textSelection:
    Platform.OS === 'ios'
      ? accent
      : // accent with less opacity
        'rgba(166,237,142, 0.4)',
  toolbar: PaperDarkTheme.colors.background,
  toolbarTint: PaperDarkTheme.colors.text,
  trophy: accent,
  trophyReps: '#FFE082',
  textSegmentedControl: '#FFFFFF',
  backgroundSegmentedControl: isIOS13 ? surface : '#FFFFFF',
  selectedSegmentedControl: isIOS13 ? selected : '#FFFFFF',
  snackBarBackground: '#FFFFFF',
  snackBarText: '#000000',
};

const DarkTheme: ThemeType = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...ThemeColors,
  },
};

export default DarkTheme;
