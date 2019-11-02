/* @flow */

import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import useSafeArea from './useSafeArea';

const useKeyboard = (cb: (height: number) => void) => {
  const { bottom } = useSafeArea();
  useEffect(() => {
    const keyboardOpenListener = Keyboard.addListener('keyboardDidShow', e => {
      cb(
        Platform.OS === 'ios'
          ? e.endCoordinates.height - bottom - 54 - 8 // TODO 54 bottom bar tab get from constant
          : e.endCoordinates.height - 54 // TODO 54 bottom bar tab get from constant
      );
    });

    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        cb(0);
      }
    );

    return () => {
      keyboardOpenListener.remove();
      keyboardHideListener.remove();
    };
  }, [bottom, cb]);
};

export default useKeyboard;
