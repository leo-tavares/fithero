/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';
import { Card as RNPaperCard } from 'react-native-paper';
import type { ThemeType } from '../utils/theme/withTheme';
import type { StylePropType } from '../types';

type Props = {
  // From Paper
  elevation?: number,
  onLongPress?: () => void,
  onPress?: () => void,
  children: React.Node,
  style?: StylePropType,
  theme?: ThemeType,
  testID?: string,
  accessible?: boolean,
};

const Card = (props: Props) => {
  // Till this is fixed in React Native https://github.com/facebook/react-native/issues/23090
  const elevation = Platform.OS === 'android' && Platform.Version >= 28 ? 0 : 1;

  return <RNPaperCard elevation={elevation} {...props} />;
};

Card.Content = RNPaperCard.Content;
Card.Actions = RNPaperCard.Actions;
Card.Cover = RNPaperCard.Cover;
Card.Title = RNPaperCard.Title;

export default Card;
