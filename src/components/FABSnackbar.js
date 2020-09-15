/* @flow */

import React, { Fragment, useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { FAB, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type Props = {
  show: boolean,
  onFabPress: () => mixed,
  onDismiss: () => mixed,
  fabIcon: string,
  snackbarText: string,
};

const animationDuration = 200;
const useNativeDriver = true;

const FABSnackbar = ({
  show,
  onFabPress,
  onDismiss,
  fabIcon,
  snackbarText,
}: Props) => {
  const navigation = useNavigation();
  const [fabAnimatedValue] = useState(new Animated.Value(0));
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (!snackbarVisible && show) {
      Animated.timing(fabAnimatedValue, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver,
      }).start();
      setSnackbarVisible(true);
    } else if (snackbarVisible && !show) {
      Animated.timing(fabAnimatedValue, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver,
      }).start();
      setSnackbarVisible(false);
    }
  }, [fabAnimatedValue, show, snackbarVisible]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (snackbarVisible) {
        onDismiss();
      }
    });

    return () => unsubscribe();
  }, [navigation, onDismiss, snackbarVisible]);

  return (
    <Fragment>
      <FAB
        icon={fabIcon}
        onPress={onFabPress}
        style={[
          styles.fab,
          {
            transform: [
              {
                translateY: fabAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -48],
                }),
              },
            ],
          },
        ]}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismiss}
        duration={Snackbar.DURATION_SHORT}
        theme={{
          colors: {
            onSurface: colors.snackBarBackground,
            surface: colors.snackBarText,
          },
        }}
      >
        {snackbarText}
      </Snackbar>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default FABSnackbar;
