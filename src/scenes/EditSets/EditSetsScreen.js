/* @flow */

import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';

import Screen from '../../components/Screen';
import { getExerciseSchemaId } from '../../database/utils';
import EditSetsWithControls from './EditSetsWithControls';
import type { DefaultUnitSystemType } from '../../redux/modules/settings';
import { getWorkoutExerciseById } from '../../database/services/WorkoutExerciseService';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import type { WorkoutExerciseSchemaType } from '../../database/types';
import { getExerciseName } from '../../utils/exercises';

type RouteType = {
  params: {
    day: string,
    exerciseKey: string,
    exerciseName?: string,
    isModal?: boolean,
  },
};

type Props = {
  selectedPage?: number,
};

const EditSetsScreen = (props: Props) => {
  const route: RouteType = useRoute();
  const { day, exerciseKey, exerciseName, isModal } = route.params;
  const { selectedPage } = props;
  const defaultUnitSystem: DefaultUnitSystemType = useSelector(
    state => state.settings.defaultUnitSystem
  );

  const id = getExerciseSchemaId(day, exerciseKey);
  const { data } = useRealmResultsHook<WorkoutExerciseSchemaType>({
    query: useCallback(() => getWorkoutExerciseById(id), [id]),
  });
  const exercise = data.length > 0 ? data[0] : null;

  return (
    <Screen style={styles.container}>
      {isModal && (
        <Text style={styles.title}>
          {getExerciseName(exerciseKey, exerciseName)}
        </Text>
      )}
      <EditSetsWithControls
        testID="edit-sets-with-controls"
        day={day}
        exerciseKey={exerciseKey}
        exercise={exercise}
        defaultUnitSystem={defaultUnitSystem}
        selectedPage={selectedPage}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default EditSetsScreen;
