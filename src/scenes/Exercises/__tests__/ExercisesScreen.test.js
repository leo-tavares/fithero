/* @flow */

import React from 'react';
import { Keyboard } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import { exercises } from 'fithero-exercises';

import ExercisesScreen from '../';
import { ThemeProvider } from 'react-native-paper';
import { defaultTheme } from '../../../utils/theme';

class RealmResults extends Array<*> {
  addListener = jest.fn();
  removeAllListeners = jest.fn();
}

const mockRealmResults = new RealmResults();
const mockRealmRecentResults = new RealmResults();
mockRealmRecentResults.push({ type: 'bench-press' }, { type: 'barbell-squat' });

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const realPlatform = jest.requireActual(
    'react-native/Libraries/Utilities/Platform'
  );
  return {
    ...realPlatform,
    OS: 'android',
  };
});
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard');
jest.mock('../../../database/services/ExerciseService', () => ({
  getAllExercises: () => mockRealmResults,
}));
jest.mock('../../../database/services/WorkoutExerciseService', () => ({
  getRecentExercises: () => mockRealmRecentResults,
}));

describe('ExercisesScreen', () => {
  const _render = () =>
    render(
      <ThemeProvider theme={defaultTheme}>
        <ExercisesScreen
          navigation={{
            addListener: jest.fn(),
            goBack: jest.fn(),
            setOptions: jest.fn(),
            navigate: jest.fn(),
            push: jest.fn(),
            dispatch: jest.fn(),
          }}
          route={{
            params: { day: '2019-03-30' },
          }}
        />
      </ThemeProvider>
    );

  it('shows all exercises if no filters', () => {
    const { getByTestId } = _render();
    const exercisesList = getByTestId('exercisesList');

    expect(exercisesList.props.sections[0].data[0]).toEqual(
      expect.objectContaining({ id: 'barbell-squat' })
    );
    expect(exercisesList.props.sections[0].data[1]).toEqual(
      expect.objectContaining({ id: 'bench-press' })
    );
    expect(exercisesList.props.sections[1].data).toHaveLength(exercises.length);
  });

  it('filters by search query', () => {
    const { getByTestId } = _render();

    fireEvent.changeText(getByTestId('searchExercisesBar'), 'Barbell squat');

    const exercisesList = getByTestId('exercisesList');
    const data = exercisesList.props.sections[1].data;
    expect(data.find(e => e.id === 'barbell-squat')).toBeDefined();
  });

  it('filters by tag', () => {
    const { getByTestId } = _render();

    fireEvent.press(getByTestId('core'));

    const filteredExercises = exercises.filter(e => e.primary[0] === 'abs');

    const data = getByTestId('exercisesList').props.sections[1].data;
    expect(data).toEqual(filteredExercises);
  });

  it('filters by search and tag - match', () => {
    const { getByTestId } = _render();

    fireEvent.press(getByTestId('core'));
    fireEvent.changeText(getByTestId('searchExercisesBar'), 'Air bike');

    const data = getByTestId('exercisesList').props.sections[1].data;
    expect(data).toEqual([
      expect.objectContaining({
        id: 'air-bike',
        primary: ['abs'],
        secondary: [],
      }),
    ]);
  });

  it('filters by search and tag - no match', () => {
    const { getByTestId } = _render();

    fireEvent.press(getByTestId('legs'));
    fireEvent.changeText(getByTestId('searchExercisesBar'), 'Air bike');

    const data = getByTestId('exercisesList').props.sections[1].data;
    expect(data).toEqual([]);
  });

  it('filters by search escaping special characters', () => {
    const { getByTestId } = _render();

    fireEvent.changeText(
      getByTestId('searchExercisesBar'),
      'Bench Press: Barbell (Decline)'
    );

    const data = getByTestId('exercisesList').props.sections[1].data;
    expect(
      data.find(e => e.id === 'decline-barbell-bench-press')
    ).toBeDefined();
  });

  it('pushes a new screen when clicking an exercise and dismiss the keyboard', () => {
    const { getByTestId } = _render();
    expect(Keyboard.dismiss).not.toHaveBeenCalled();
    fireEvent.press(getByTestId('bench-press'));
    expect(Keyboard.dismiss).toHaveBeenCalled();
  });
});
