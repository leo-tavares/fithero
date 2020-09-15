/* @flow */

import React from 'react';
import { Keyboard } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

import { EditSetsWithControls } from '../EditSetsWithControls';
import { toDate } from '../../../utils/date';
import {
  deleteSet,
  getLastSetByType,
  getMaxSetByType,
} from '../../../database/services/WorkoutSetService';
import { MockRealmArray } from '../../../database/services/__tests__/helpers/databaseMocks';
import type { WorkoutExerciseSchemaType } from '../../../database/types';

jest.mock('react-native/Libraries/Components/Keyboard/Keyboard');

jest.mock('../../../database/services/WorkoutSetService', () => ({
  addSet: jest.fn(),
  deleteSet: jest.fn(),
  getLastSetByType: jest.fn(() => []),
  updateSet: jest.fn(),
  getMaxSetByType: jest.fn(),
  getMaxRepByType: jest.fn(),
}));

jest.mock('../../../database/services/WorkoutExerciseService');

jest.mock('../../../hooks/useKeyboard');

jest.mock('../../../hooks/useMaxSetHook');

const date = toDate('2018-05-01T00:00:00.000Z');

describe('EditSetsWithControls', () => {
  const day = '2018-05-01T00:00:00.000Z';
  const exerciseKey = 'bench-press';
  const exercise = {
    id: '2018-05-01T00:00:00.000Z_bench-press',
    sets: [
      {
        id: '2018-05-01T00:00:00.000Z_bench-press_001',
        reps: 8,
        weight: 100,
        date,
        type: 'bench-press',
      },
      {
        id: '2018-05-01T00:00:00.000Z_bench-press_002',
        reps: 6,
        weight: 90,
        date,
        type: 'bench-press',
      },
    ],
    date,
    type: 'bench-press',
    sort: 0,
    weight_unit: 'metric',
    isValid: jest.fn(() => true),
  };

  const defaultWeight = 20;
  const defaultReps = 8;

  describe('EditSetsInputControls', () => {
    it('has correct default values if there is no exercise', () => {
      const { getByTestId } = render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
          selectedPage={0}
        />
      );

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');
      const weightLabel = getByTestId('weightInputLabel');
      const repsLabel = getByTestId('repsInputLabel');

      expect(weightInput.props.input).toEqual(defaultWeight.toString());
      expect(repsInput.props.input).toEqual(defaultReps.toString());
      expect(weightLabel.props.children).toEqual('Weight (kgs)');
      expect(repsLabel.props.children).toEqual('Reps');
    });

    it('has the values of last set if we pass an exercise', () => {
      const { getByTestId } = render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercise={{
            weight_unit: 'metric',
            sort: 1,
            isValid: jest.fn(),
            ...exercise,
          }}
          exercisesCount={1}
          defaultUnitSystem="metric"
          selectedPage={0}
        />
      );

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');

      expect(weightInput.props.input).toEqual(
        exercise.sets[1].weight.toString()
      );
      expect(repsInput.props.input).toEqual(exercise.sets[1].reps.toString());
    });

    it('has values of last set (from another day) if no exercise', () => {
      const mockLastSet = {
        id: '2018-05-01T00:00:00.000Z_bench-press_002',
        reps: 6,
        weight: 90,
        date: toDate('2018-05-01T00:00:00.000Z'),
        type: 'bench-press',
      };

      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => [mockLastSet]);

      const { getByTestId } = render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={0}
          defaultUnitSystem="metric"
          exercise={null}
          selectedPage={0}
        />
      );

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');

      expect(weightInput.props.input).toEqual(mockLastSet.weight.toString());
      expect(repsInput.props.input).toEqual(mockLastSet.reps.toString());
    });

    it('changes input(s) state using the TextInput', () => {
      const { getByTestId } = render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
          selectedPage={0}
        />
      );

      const weightInput = getByTestId('weightInput');
      const repsInput = getByTestId('repsInput');

      fireEvent.changeText(weightInput, '50');
      fireEvent.changeText(repsInput, '5');

      expect(weightInput.props.input).toEqual('50');
      expect(repsInput.props.input).toEqual('5');
    });

    it.skip('handles empty TextInput', () => {
      // TODO write test
    });

    it('uses -2, -1, +1, +2 buttons for reps', () => {
      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => []);

      const { getByTestId } = render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
          selectedPage={0}
        />
      );

      const repsInput = getByTestId('repsInput');
      const repsInputControlLeft = getByTestId('repsInputControlLeft');
      const repsInputControlRight = getByTestId('repsInputControlRight');

      fireEvent.press(repsInputControlLeft);
      expect(repsInput.props.input).toEqual((defaultReps - 1).toString());
      fireEvent.press(repsInputControlRight);
      fireEvent.press(repsInputControlRight);
      expect(repsInput.props.input).toEqual(
        (defaultReps - 1 + 1 + 1).toString()
      );
    });

    it('uses -1.0, -0.5, +0.5, +1.0 buttons for weight', () => {
      // $FlowFixMe Flow does not now this is a mock
      getLastSetByType.mockImplementation(() => []);

      const { getByTestId } = render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={null}
          selectedPage={0}
        />
      );

      const weightInput = getByTestId('weightInput');
      const weightInputControlLeft = getByTestId('weightInputControlLeft');
      const weightInputControlRight = getByTestId('weightInputControlRight');

      fireEvent.press(weightInputControlLeft);
      expect(weightInput.props.input).toEqual((defaultWeight - 1).toString());
      fireEvent.press(weightInputControlRight);
      fireEvent.press(weightInputControlRight);
      expect(weightInput.props.input).toEqual(
        (defaultWeight - 1 + 1 + 1).toString()
      );
    });
  });

  describe('EditSetActionButtons and back button', () => {
    const _render = () =>
      render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={exercise}
          selectedPage={0}
        />
      );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('switches between Add and Update text if a set is selected', () => {
      const { getByTestId } = _render();
      expect(getByTestId('addSetButton').props.children).toBe('Add');
      fireEvent.press(getByTestId('editSetItem-1'));
      // expect(getByTestId('addSetButton').props.children).toBe('Update');
    });

    it('switches Delete button to enabled/disabled depending on set selection', () => {
      const { getByTestId } = _render();
      const deleteSetButton = getByTestId('deleteSetButton');

      // Nothing selected
      expect(deleteSetButton.props.disabled).toBe(true);
      fireEvent.press(getByTestId('editSetItem-1'));
      // Something selected means delete button is enabled
      expect(deleteSetButton.props.disabled).toBe(false);
    });

    it('handles back button if an option is selected', () => {
      const { getByTestId } = _render();
      const androidBackHandler = getByTestId('androidBackHandler');

      fireEvent.press(getByTestId('editSetItem-1'));
      expect(getByTestId('addSetButton').props.children).toBe('Update');

      androidBackHandler.props.onBackPress();
      expect(getByTestId('addSetButton').props.children).toBe('Add');
    });

    it('adds a set and dismiss the keyboard', () => {
      const { getByTestId } = _render();

      expect(Keyboard.dismiss).not.toHaveBeenCalled();

      fireEvent.press(getByTestId('addSetButton'));

      expect(Keyboard.dismiss).toHaveBeenCalled();

      // TODO test rest of logic inside here
    });

    it('deletes a set and dismiss the keyboard', () => {
      const { getByTestId } = _render();

      expect(Keyboard.dismiss).not.toHaveBeenCalled();

      fireEvent.press(getByTestId('deleteSetButton'));

      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(deleteSet).toHaveBeenCalledTimes(1);
    });
  });

  describe('Weight units', () => {
    // $FlowFixMe
    getMaxSetByType.mockImplementation(
      () => new MockRealmArray({ ...exercise.sets[0] })
    );

    const _renderComponent = (customExercise?: WorkoutExerciseSchemaType) =>
      render(
        <EditSetsWithControls
          day={day}
          exerciseKey={exerciseKey}
          exercisesCount={1}
          defaultUnitSystem="metric"
          exercise={customExercise || exercise}
          selectedPage={0}
        />
      );

    it('renders kgs or lbs', () => {
      const { toJSON: metricJSON } = _renderComponent();
      const { toJSON: imperialJSON } = _renderComponent({
        ...exercise,
        weight_unit: 'imperial',
      });

      // $FlowFixMe
      expect(metricJSON()).toMatchDiffSnapshot(imperialJSON(), {
        contextLines: 0,
        stablePatchmarks: true,
      });
    });
  });
});
