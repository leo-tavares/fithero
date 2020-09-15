/* @flow */

import * as React from 'react';
import { useCallback, memo } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import i18n from '../../utils/i18n';
import type { WorkoutSetSchemaType } from '../../database/types';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';
import { toLb, toTwoDecimals } from '../../utils/metrics';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';

type Props = {|
  isSelected: boolean,
  maxSetType: 'maxSet' | 'maxRep' | null,
  onPressItem: (setId: string) => void,
  index: number,
  set: WorkoutSetSchemaType,
  theme: ThemeType,
  unit: DefaultUnitSystemType,
|};

const EditSetItem = (props: Props) => {
  const {
    index,
    isSelected,
    maxSetType,
    onPressItem,
    set,
    theme,
    unit,
  } = props;

  const onPress = useCallback(() => {
    onPressItem(set.id);
  }, [onPressItem, set.id]);

  return (
    <TouchableWithoutFeedback onPress={onPress} testID={`editSetItem-${index}`}>
      <View
        style={[
          styles.item,
          isSelected && { backgroundColor: theme.colors.selected },
        ]}
      >
        <View style={styles.leftContent}>
          <Text style={[styles.text, styles.index]}>{index}.</Text>
          <Icon
            name="trophy"
            size={24}
            color={
              maxSetType === 'maxRep'
                ? theme.colors.trophyReps
                : theme.colors.trophy
            }
            style={[styles.icon, !maxSetType && styles.notMax]}
          />
        </View>
        <Text style={[styles.text, styles.weight]}>
          {unit === 'metric'
            ? toTwoDecimals(set.weight)
            : toTwoDecimals(toLb(set.weight))}{' '}
          <Text style={[styles.unit, { color: theme.colors.secondaryText }]}>
            {unit === 'metric'
              ? i18n.t('kg.unit', { count: set.weight })
              : i18n.t('lb')}{' '}
          </Text>
        </Text>
        <Text style={[styles.text, styles.reps]}>
          {set.reps}{' '}
          <Text style={[styles.unit, { color: theme.colors.secondaryText }]}>
            {i18n.t('reps.unit', { count: set.reps })}{' '}
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 36,
  },
  text: {
    fontSize: 18,
  },
  leftContent: {
    flexDirection: 'row',
    flex: 0.25,
  },
  index: {
    textAlign: 'left',
  },
  icon: {
    marginHorizontal: 24,
    height: 24,
    width: 24,
  },
  weight: {
    flex: 0.5,
    textAlign: 'right',
  },
  reps: {
    flex: 0.5,
    paddingLeft: 16,
    textAlign: 'right',
  },
  unit: {
    fontSize: 14,
  },
  notMax: {
    opacity: 0,
  },
});

export default withTheme(
  memo(EditSetItem, (prevProps, nextProps) => {
    if (
      prevProps.isSelected !== nextProps.isSelected ||
      prevProps.maxSetType !== nextProps.maxSetType ||
      prevProps.onPressItem !== nextProps.onPressItem ||
      prevProps.index !== nextProps.index ||
      prevProps.unit !== nextProps.unit ||
      prevProps.theme !== nextProps.theme
    ) {
      return false;
    }

    return (
      // Doing it like this because of Realm
      JSON.stringify(prevProps.set) === JSON.stringify(nextProps.set)
    );
  })
);
