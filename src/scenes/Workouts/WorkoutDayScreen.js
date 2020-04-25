/* @flow */

import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { dateToWorkoutId } from '../../utils/date';
import { getWorkoutById } from '../../database/services/WorkoutService';
import type { WorkoutSchemaType } from '../../database/types';
import WorkoutScreen from '../../components/Workouts/WorkoutScreen';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import { useRoute } from '@react-navigation/native';
import { toggleSnackbar } from '../../redux/modules/workoutDay';

const WorkoutDayScreen = () => {
  const route = useRoute();
  const workoutId = dateToWorkoutId(route.params.day);
  const showSnackbar = useSelector(state => state.workoutDay.showSnackbar);
  const dispatch = useDispatch();

  const { data } = useRealmResultsHook<WorkoutSchemaType>({
    query: useCallback(() => getWorkoutById(workoutId), [workoutId]),
  });

  const workout = data.length > 0 ? data[0] : null;

  const dismissSnackbar = useCallback(() => {
    dispatch(toggleSnackbar(false));
  }, [dispatch]);

  return (
    <WorkoutScreen
      contentContainerStyle={styles.list}
      workout={workout && workout.isValid() ? workout : null}
      workoutId={workoutId}
      snackbarVisible={showSnackbar}
      dismissSnackbar={dismissSnackbar}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 56 + 32, // Taking FAB into account
  },
});

export default WorkoutDayScreen;
