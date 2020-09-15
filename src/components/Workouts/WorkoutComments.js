/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';
import Card from '../Card';

type Props = {
  comments: string,
  day: string,
  theme: ThemeType,
};

const WorkoutComments = (props: Props) => {
  const { navigate } = useNavigation();
  const { comments, day } = props;
  const { colors } = props.theme;

  return (
    <Card
      style={styles.comments}
      onPress={() => {
        navigate('Comments', { day });
      }}
    >
      <Card.Content>
        <Text style={{ color: colors.secondaryText }}>{comments}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  comments: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
});

export default withTheme(WorkoutComments);
