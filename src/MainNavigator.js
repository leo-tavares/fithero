/* @flow */

import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import tabBarIcon from './components/tabBarIcon';
import i18n from './utils/i18n';
import HomeNavigator from './scenes/HomeNavigator';
import SettingsNavigator from './scenes/SettingsNavigator';
import StatisticsNavigator from './scenes/StatisticsNavigator';
import EditExerciseScreen from './scenes/EditExercise/EditExerciseScreen';
import CopyWorkoutScreen from './scenes/CopyWorkout';
import EditSetsScreen from './scenes/EditSets/EditSetsScreen';

const TabsStack = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('home'),
        title: i18n.t('menu__home'),
      },
    },
    Statistics: {
      screen: StatisticsNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('show-chart'),
        title: i18n.t('menu__statistics'),
      },
    },
    Settings: {
      screen: SettingsNavigator,
      navigationOptions: {
        tabBarIcon: tabBarIcon('settings'),
        title: i18n.t('menu__settings'),
      },
    },
  },
  {
    initialRouteName: 'Home',
    shifting: false,
    keyboardHidesNavigationBar: false,
  }
);

const MainStack = createStackNavigator(
  {
    Tabs: {
      screen: TabsStack,
      navigationOptions: {
        header: null,
      },
    },
    CopyWorkout: {
      screen: CopyWorkoutScreen,
      navigationOptions: {
        title: null,
      },
    },
  },
  {
    headerMode: 'screen',
  }
);

export default createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: MainStack,
        navigationOptions: {
          header: null,
          gesturesEnabled: false,
        },
      },
      EditExercise: {
        screen: EditExerciseScreen,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      EditSetsModal: {
        screen: EditSetsScreen,
      },
    },
    {
      mode: 'modal',
    }
  )
);
