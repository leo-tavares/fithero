/* @flow */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';

import App from './src/App';

if (!global.__DEV__) {
  // eslint-disable-next-line global-require
  require('./src/utils/bugsnag');
}

AppRegistry.registerComponent('FitHero', () => App);
