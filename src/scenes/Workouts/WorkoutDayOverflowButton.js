/* @flow */

import React, { useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import type { HeaderOverflowButtonProps } from '../../components/Header/HeaderOverflowButton';
import HeaderOverflowButton from '../../components/Header/HeaderOverflowButton';
import { dispatch } from '../../redux/configureStore';
import { toggleSnackbar } from '../../redux/modules/workoutDay';
import { handleWorkoutToolbarMenu } from '../../utils/overflowActions';
import { dateToWorkoutId } from '../../utils/date';

const WorkoutDayOverflowButton = (props: HeaderOverflowButtonProps) => {
  const { navigate } = useNavigation();
  const route = useRoute();
  const workoutId = dateToWorkoutId(route.params.day);

  const handleToolbarMenu = useCallback(
    (index: number) => {
      handleWorkoutToolbarMenu({
        index,
        selectedDay: workoutId,
        navigate,
        showSnackbar: () => dispatch(toggleSnackbar(true)),
      });
    },
    [navigate, workoutId]
  );

  return <HeaderOverflowButton {...props} onPress={handleToolbarMenu} />;
};

export default WorkoutDayOverflowButton;
