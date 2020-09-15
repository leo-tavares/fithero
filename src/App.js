/* @flow */

import * as React from 'react';
import { Platform, StatusBar, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import SafeAreaProvider from './components/SafeAreaProvider';

import store from './redux/configureStore';
import MainNavigator from './MainNavigator';
import { Settings } from './utils/constants';
import { initSettings } from './redux/modules/settings';
import { getDefaultUnitSystemByCountry } from './utils/metrics';
import {
  firstDayOfTheWeekToNumber,
  getCurrentLocale,
  getWeekStartByLocale,
  setMomentFirstDayOfTheWeek,
} from './utils/date';
import PaperThemeProvider from './PaperThemeProvider';

if (global.__DEV__) {
  YellowBox.ignoreWarnings([
    // https://github.com/react-navigation/react-navigation/issues/3956
    'Warning: isMounted(...) is deprecated',
    'Module RCTImageLoader',
    // https://github.com/facebook/react-native/issues/18201
    'Warning: Class RCTCxxModule was not exported',
    // Comes from react-navigation
    'Warning: AsyncStorage has been extracted',
    '-[RCTRootView cancelTouches]` is deprecated and will be deleted soon.',
    // Comes from react-native-tabbed-view-pager-android
    'Accessing view manager configs directly off UIManager',
    // Comes from some libraries too
    'componentWillReceiveProps is deprecated',
    'Warning: componentWillReceiveProps has been renamed',
    // Moment deprecation
    'Deprecation warning: use moment.updateLocale',
  ]);
}

type State = {
  loading: boolean,
};

export default class App extends React.Component<{}, State> {
  state = {
    loading: true,
  };

  componentDidMount() {
    this._loadSettings();
  }

  _loadSettings = async () => {
    const locale = getCurrentLocale();

    let defaultUnitSystem = await AsyncStorage.getItem(
      Settings.defaultUnitSystem
    );
    if (defaultUnitSystem === null) {
      defaultUnitSystem = getDefaultUnitSystemByCountry();
      await AsyncStorage.setItem(Settings.defaultUnitSystem, defaultUnitSystem);
    }

    let firstDayOfTheWeek = await AsyncStorage.getItem(
      Settings.firstDayOfTheWeek
    );
    if (firstDayOfTheWeek === null) {
      firstDayOfTheWeek = getWeekStartByLocale(locale);
      await AsyncStorage.setItem(Settings.firstDayOfTheWeek, firstDayOfTheWeek);
    }
    setMomentFirstDayOfTheWeek(
      locale,
      firstDayOfTheWeekToNumber(firstDayOfTheWeek)
    );

    const appTheme =
      (await AsyncStorage.getItem(Settings.appTheme)) || 'default';

    store.dispatch(
      initSettings({
        defaultUnitSystem,
        firstDayOfTheWeek,
        appTheme: appTheme || 'default',
      })
    );

    this.setState({ loading: false });
  };

  render() {
    return (
      <Provider store={store}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        {!this.state.loading && (
          <PaperThemeProvider>
            <SafeAreaProvider>
              <MainNavigator />
            </SafeAreaProvider>
          </PaperThemeProvider>
        )}
      </Provider>
    );
  }
}
