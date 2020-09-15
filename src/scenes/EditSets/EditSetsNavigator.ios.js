/* @flow */

import * as React from 'react';
import { PixelRatio, SegmentedControlIOS, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import EditSetsScreen from './EditSetsScreen';
import { getExerciseName } from '../../utils/exercises';
import ExerciseHistory from './ExerciseHistory';

import i18n from '../../utils/i18n';
import { dateToString, getDatePrettyFormat, getToday } from '../../utils/date';
import withTheme from '../../utils/theme/withTheme';
import type { ThemeType } from '../../utils/theme/withTheme';
import Screen from '../../components/Screen';

type RouteType = {
  params: {
    day: string,
    exerciseKey: string,
    exerciseName?: string,
  },
};

type Props = {
  theme: ThemeType,
  route: RouteType,
};

type State = {
  selectedIndex: number,
};

class EditSetsNavigator extends React.Component<Props, State> {
  state = {
    selectedIndex: 0,
  };

  render() {
    const { route, theme }: { route: RouteType, theme: ThemeType } = this.props;
    const { selectedIndex } = this.state;

    const ContentComponent =
      selectedIndex === 0 ? EditSetsScreen : ExerciseHistory;

    return (
      <Screen>
        <Text style={styles.title}>
          {getExerciseName(route.params.exerciseKey, route.params.exerciseName)}
        </Text>
        <SegmentedControlIOS
          values={[
            getDatePrettyFormat(
              route.params.day,
              dateToString(getToday()),
              PixelRatio.get() < 3,
              true
            ),
            i18n.t('history'),
          ]}
          selectedIndex={this.state.selectedIndex}
          onChange={event => {
            this.setState({
              selectedIndex: event.nativeEvent.selectedSegmentIndex,
            });
          }}
          tintColor={theme.colors.selectedSegmentedControl}
          backgroundColor={theme.colors.backgroundSegmentedControl}
          textColor={theme.colors.textSegmentedControl}
          style={styles.tabs}
        />
        <ContentComponent />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontWeight: 'bold',
  },
  tabs: {
    marginTop: 12,
    marginHorizontal: 16,
  },
});

export default withTheme(EditSetsNavigator);
