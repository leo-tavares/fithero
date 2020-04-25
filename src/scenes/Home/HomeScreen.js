/* @flow */

import React, { useCallback, useMemo, useEffect } from 'react';
import {
  InteractionManager,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Screen from '../../components/Screen';
import DayRow from './DayRow';
import {
  getCurrentWeek,
  getSafeTimezoneTime,
  getToday,
} from '../../utils/date';
import { getWorkoutsByRange } from '../../database/services/WorkoutService';
import type { WorkoutSchemaType } from '../../database/types';
import type {
  AppThemeType,
  FirstDayOfTheWeekType,
} from '../../redux/modules/settings';
import { hideSplashScreen } from '../../native/RNSplashScreen';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import WorkoutScreen from '../../components/Workouts/WorkoutScreen';
import { toggleSnackbar } from '../../redux/modules/home';

const HomeScreen = () => {
  const selectedDay = useSelector(state => state.home.selectedDay);
  const showSnackbar = useSelector(state => state.home.showSnackbar);
  const dispatch = useDispatch();

  // Even if not using the prop, we use it to re-render if this has changed
  const firstDayOfTheWeek: FirstDayOfTheWeekType = useSelector(
    state => state.settings.firstDayOfTheWeek
  );
  const appTheme: AppThemeType = useSelector(state => state.settings.appTheme);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const today = useMemo(() => getToday(), [firstDayOfTheWeek]);
  const currentWeek = useMemo(() => getCurrentWeek(today), [today]);

  useEffect(() => {
    if (Platform.OS === 'android' && appTheme === 'dark') {
      StatusBar.setBackgroundColor('#000000');
    }
  }, [appTheme]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      hideSplashScreen();
    });
  }, []);

  const { data: workoutsByRange } = useRealmResultsHook<WorkoutSchemaType>({
    query: useCallback(
      () =>
        getWorkoutsByRange(getSafeTimezoneTime(currentWeek[0]), currentWeek[6]),
      [currentWeek]
    ),
  });

  const workouts = workoutsByRange.reduce((obj, item) => {
    // eslint-disable-next-line no-param-reassign
    obj[item.id] = item;
    return obj;
  }, {});

  const renderHeader = useCallback(() => {
    return <DayRow currentWeek={currentWeek} />;
  }, [currentWeek]);

  const dismissSnackbar = useCallback(() => {
    dispatch(toggleSnackbar(false));
  }, [dispatch]);

  return (
    <Screen>
      <WorkoutScreen
        contentContainerStyle={styles.list}
        workout={
          workouts && workouts[selectedDay] && workouts[selectedDay].isValid()
            ? workouts[selectedDay]
            : null
        }
        workoutId={selectedDay}
        ListHeaderComponent={renderHeader}
        extraListData={currentWeek}
        snackbarVisible={showSnackbar}
        dismissSnackbar={dismissSnackbar}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingBottom: 56 + 32, // Taking FAB into account
  },
});

export default HomeScreen;
