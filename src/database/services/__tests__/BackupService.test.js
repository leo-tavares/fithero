/* @flow */

import { FileSystem } from 'react-native-unimodules';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Share from 'react-native-share';
import * as DocumentPicker from 'expo-document-picker';

import { backupDatabase, restoreDatabase } from '../BackupService';
import { WORKOUT_SCHEMA_NAME } from '../../schemas/WorkoutSchema';
import realm from '../../../database';
import { EXERCISE_SCHEMA_NAME } from '../../schemas/ExerciseSchema';
import { Settings } from '../../../utils/constants';
import { setMomentFirstDayOfTheWeek } from '../../../utils/date';

const mockMomentDate = moment('2019-03-30T00:00:00.000Z').utc(false);

jest.mock('../../../utils/date', () => {
  const actualDate = jest.requireActual('../../../utils/date');
  return {
    ...actualDate,
    getToday: () => mockMomentDate,
    setMomentFirstDayOfTheWeek: jest.fn(),
    getCurrentLocale: () => 'en',
  };
});

const mockExercise = {
  name: 'My Custom Exercises',
  notes: '',
  primary: ['abs'],
  secondary: [],
};

const dateString = '2019-03-30T00:00:00.000Z';
const dateStringSecond = '2019-03-31T00:00:00.000Z';

const mockWorkouts = [
  {
    id: dateString,
    date: dateString,
    exercises: [
      {
        id: `${dateString}_bench-press`,
        date: dateString,
        type: 'bench-press',
        sort: 1,
        sets: [
          {
            id: `${dateString}_bench-press_001`,
            reps: 6,
            weight: 100,
            date: dateString,
            type: 'bench-press',
          },
          {
            id: `${dateString}_bench-press_001`,
            reps: 6,
            weight: 100,
            date: dateString,
            type: 'bench-press',
          },
        ],
      },
    ],
  },
  {
    id: dateStringSecond,
    date: dateStringSecond,
    type: 'barbell-squat',
    exercises: [
      {
        id: `${dateStringSecond}barbell-squat`,
        date: dateStringSecond,
        type: 'barbell-squat',
        sort: 1,
        sets: [
          {
            id: `${dateStringSecond}_barbell-squat_001`,
            reps: 6,
            weight: 120,
            date: dateStringSecond,
            type: 'barbell-squat',
          },
        ],
      },
    ],
  },
];

const mockBackup = {
  workouts: mockWorkouts,
  exercises: [mockExercise],
  settings: {
    [Settings.appTheme]: 'default',
    [Settings.defaultUnitSystem]: 'metric',
    [Settings.firstDayOfTheWeek]: 'monday',
  },
};

describe('BackupService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  AsyncStorage.getAllKeys.mockImplementation(() => [
    Settings.appTheme,
    Settings.defaultUnitSystem,
    Settings.firstDayOfTheWeek,
  ]);
  AsyncStorage.multiGet.mockImplementation(() => [
    [Settings.appTheme, 'default'],
    [Settings.defaultUnitSystem, 'metric'],
    [Settings.firstDayOfTheWeek, 'monday'],
  ]);

  realm.objects = jest.fn(schema => {
    if (schema === WORKOUT_SCHEMA_NAME) {
      return mockWorkouts;
    } else if (schema === EXERCISE_SCHEMA_NAME) {
      return [mockExercise];
    }
  });

  it('backups the database and the settings', async () => {
    await backupDatabase();
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      'testCache/fithero-backup-2019-03-30.json',
      JSON.stringify(mockBackup)
    );
    expect(Share.open).toHaveBeenCalledWith({
      type: 'text/plain',
      url: 'file://testCache/fithero-backup-2019-03-30.json',
    });
  });

  it('deletes old files when doing a backup', async () => {
    FileSystem.readDirectoryAsync.mockImplementation(() => [
      'fithero-backup-2019-02-20.json',
      'fithero-backup-2019-03-10.json',
    ]);
    await backupDatabase();
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'testCache/fithero-backup-2019-02-20.json'
    );
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      'testCache/fithero-backup-2019-03-10.json'
    );
  });

  it('restores the database and the settings', async () => {
    const initSettings = jest.fn();
    DocumentPicker.getDocumentAsync.mockImplementation(() => ({
      uri: 'Downloads',
      name: 'fithero-backup-2019-03-30.json',
    }));
    FileSystem.readAsStringAsync.mockImplementation(() =>
      JSON.stringify(mockBackup)
    );

    await restoreDatabase(initSettings);

    expect(FileSystem.copyAsync).toHaveBeenCalledWith({
      from: 'Downloads',
      to: 'testCache/fithero-backup-2019-03-30.json',
    });
    expect(setMomentFirstDayOfTheWeek).toHaveBeenCalledWith('en', 1, true);
    expect(initSettings).toHaveBeenCalledWith({
      appTheme: 'default',
      defaultUnitSystem: 'metric',
      firstDayOfTheWeek: 'monday',
    });
    expect(realm.deleteAll).toHaveBeenCalled();
    expect(realm.create).toHaveBeenCalledWith(
      EXERCISE_SCHEMA_NAME,
      mockExercise
    );
    expect(realm.create).toHaveBeenCalledWith(
      WORKOUT_SCHEMA_NAME,
      mockWorkouts[0]
    );
    expect(realm.create).toHaveBeenCalledWith(
      WORKOUT_SCHEMA_NAME,
      mockWorkouts[1]
    );
  });

  it('does not do a restore if user cancels the operation', async () => {
    DocumentPicker.getDocumentAsync.mockImplementation(() => ({
      type: 'cancel',
    }));

    await restoreDatabase(jest.fn());

    expect(FileSystem.readAsStringAsync).not.toHaveBeenCalled();
  });
});
