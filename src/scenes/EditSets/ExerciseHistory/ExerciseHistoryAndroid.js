/* @flow */

import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import type { DefaultUnitSystemType } from '../../../redux/modules/settings';
import ExerciseHistory from './ExerciseHistory';

type Props = {
  type: 'string',
  unit: DefaultUnitSystemType,
};

const ExerciseHistoryAndroid = (props: Props) => {
  const [showHistory, setShowHistory] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !showHistory) {
      // We just need this once, not when we re-focus
      setShowHistory(true);
    }
  }, [isFocused, showHistory]);

  if (!showHistory) return null;

  return <ExerciseHistory {...props} />;
};

export default ExerciseHistoryAndroid;
