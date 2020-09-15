/* @flow */

import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import CopyWorkoutItem from './CopyWorkoutItem';
import { getAllWorkoutsWithExercisesSortedByDate } from '../../database/services/WorkoutService';
import {
  dateToString,
  getDatePrettyFormat,
  getToday,
  isSameDay,
} from '../../utils/date';
import { setSelectedWorkout } from '../../redux/modules/copyWorkout';
import i18n from '../../utils/i18n';
import Screen from '../../components/Screen';
import Card from '../../components/Card';

const CopyWorkoutScreen = () => {
  const route = useRoute();
  const day = route.params.day;
  const selectedWorkout = useSelector(
    state => state.copyWorkout.selectedWorkout
  );
  const dispatch = useDispatch();
  const workouts = getAllWorkoutsWithExercisesSortedByDate();
  const todayString = dateToString(getToday());

  useEffect(() => {
    return () => {
      dispatch(setSelectedWorkout(null));
    };
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }) => {
      if (isSameDay(item.date, day)) {
        return null;
      }
      return (
        <Card
          style={styles.card}
          onPress={() => dispatch(setSelectedWorkout(item))}
        >
          <CopyWorkoutItem
            workout={item}
            todayString={todayString}
            selected={selectedWorkout ? item.id === selectedWorkout.id : false}
          />
        </Card>
      );
    },
    [day, dispatch, selectedWorkout, todayString]
  );

  return (
    <Screen>
      <Text style={styles.subheading}>
        {i18n.t('copy_to')}{' '}
        <Text style={styles.boldText}>
          {getDatePrettyFormat(day, todayString)}
        </Text>
      </Text>
      <FlatList
        keyExtractor={item => item.id}
        data={workouts}
        renderItem={renderItem}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        contentContainerStyle={styles.container}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  subheading: {
    fontSize: 15,
    padding: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  container: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
});

export default CopyWorkoutScreen;
