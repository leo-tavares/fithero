/* @flow */

import React from 'react';
import { render } from 'react-native-testing-library';

import { CalendarScreen } from '../CalendarScreen';
import theme from '../../../utils/theme';

const mockAddListener = jest.fn();
const mockRemoveListener = jest.fn();

jest.mock('../../../database/services/WorkoutService', () => ({
  getAllWorkouts: () => ({
    addListener: mockAddListener,
    removeAllListeners: mockRemoveListener,
  }),
}));

// Call it immediately
global.requestAnimationFrame = jest.fn(cb => cb());

test('remove realm listeners on unmounting', () => {
  const { unmount } = render(
    <CalendarScreen
      navigation={{
        addListener: jest.fn(),
        setOptions: jest.fn(),
        navigate: jest.fn(),
        push: jest.fn(),
        goBack: jest.fn(),
        dispatch: jest.fn(),
      }}
      route={{ params: { today: '07/10/2018' } }}
      firstDay={0}
      theme={theme}
    />
  );

  expect(mockAddListener).toHaveBeenCalledTimes(1);
  expect(mockRemoveListener).toHaveBeenCalledTimes(0);

  unmount();

  expect(mockRemoveListener).toHaveBeenCalledTimes(1);
});
