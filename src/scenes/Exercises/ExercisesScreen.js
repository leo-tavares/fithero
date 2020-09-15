/* @flow */

import React, { Component } from 'react';
import {
  SectionList,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Caption, Divider, IconButton, Searchbar } from 'react-native-paper';
import { exercises as fitHeroExercises } from 'fithero-exercises';
import sortBy from 'lodash/sortBy';

import Screen from '../../components/Screen';
import ExerciseItem from './ExerciseItem';
import ExerciseHeader from './ExerciseHeader';
import type { NavigationType, RealmResults } from '../../types';
import ChipsCategory from '../../components/ChipsCategory';
import { mapCategories, mainCategories } from '../../utils/muscles';
import i18n from '../../utils/i18n';
import { getExerciseName, searchExerciseByName } from '../../utils/exercises';
import type { ThemeType } from '../../utils/theme/withTheme';
import withTheme from '../../utils/theme/withTheme';
import type {
  ExerciseSchemaType,
  WorkoutExerciseSchemaType,
} from '../../database/types';
import { getAllExercises } from '../../database/services/ExerciseService';
import { deserializeExercises } from '../../database/utils';
import { getRecentExercises } from '../../database/services/WorkoutExerciseService';
import { getToday, toDate } from '../../utils/date';

type Props = {
  theme: ThemeType,
  route: {
    params: {
      day: string,
    },
  },
  navigation: NavigationType,
};

type State = {
  exercises: Array<ExerciseSchemaType>,
  recentExercises: Array<ExerciseSchemaType>,
  searchQuery: string,
  tagSelection: { [key: string]: boolean },
};

class ExercisesScreen extends Component<Props, State> {
  realmExercises: RealmResults<ExerciseSchemaType>;
  realmRecentExercises: RealmResults<WorkoutExerciseSchemaType>;

  constructor(props: Props) {
    super(props);
    this.realmExercises = getAllExercises();
    // We don't want to mix Realm objects and normal objects into the state because it gives
    // a lot of problems when for example, the Restore function deletes all the database.
    // The user will not often add, modify or delete exercises so deserialize here is acceptable
    const customExercises = deserializeExercises(this.realmExercises);
    const exercises = sortBy([...customExercises, ...fitHeroExercises], e =>
      getExerciseName(e.id, e.name)
    );
    this.realmRecentExercises = getRecentExercises(toDate(getToday()));
    const recentExercises = exercises.filter(e =>
      this.realmRecentExercises.find(r => e.id === r.type)
    );
    this.state = {
      exercises,
      recentExercises,
      searchQuery: '',
      tagSelection: Object.assign(
        {},
        ...mainCategories.map(item => ({ [item.id]: false }))
      ),
    };
  }

  componentDidMount() {
    this.realmExercises.addListener((exercises, changes) => {
      if (
        changes.insertions.length > 0 ||
        changes.modifications.length > 0 ||
        changes.deletions.length > 0
      ) {
        const realmExercises = getAllExercises();
        const customExercises = deserializeExercises(realmExercises);
        this.setState({
          exercises: sortBy([...customExercises, ...fitHeroExercises], e =>
            getExerciseName(e.id, e.name)
          ),
        });
      }
    });
    this.realmRecentExercises.addListener((workoutExercises, changes) => {
      if (
        changes.insertions.length > 0 ||
        changes.modifications.length > 0 ||
        changes.deletions.length > 0
      ) {
        const recentExercises = this.state.exercises.filter(e =>
          workoutExercises.find(r => e.id === r.type)
        );
        this.setState({
          recentExercises,
        });
      }
    });
  }

  componentWillUnmount() {
    this.realmExercises.removeAllListeners();
    this.realmRecentExercises.removeAllListeners();
  }

  _onExercisePress = (exercise: ExerciseSchemaType) => {
    const { day } = this.props.route.params;

    if (Platform.OS === 'android') {
      // It already works on iOS
      Keyboard.dismiss();
    }

    this.props.navigation.navigate('EditSets', {
      day,
      exerciseKey: exercise.id,
      exerciseName: exercise.name,
    });
  };

  _keyExtractor = item => item.id;

  _renderItem = ({ item }) => (
    <ExerciseItem
      exercise={item}
      navigate={this.props.navigation.navigate}
      onPressItem={this._onExercisePress}
    />
  );

  _renderSectionHeader = ({ section: { title } }) => (
    <View style={{ backgroundColor: this.props.theme.colors.background }}>
      <View style={styles.sectionHeaderContent}>
        <Caption style={styles.sectionHeaderText}>{title}</Caption>
      </View>
      <Divider />
    </View>
  );

  _onSelectCategory = (id: string) => {
    this.setState(prevState => ({
      tagSelection: {
        [id]: !prevState.tagSelection[id],
      },
    }));
  };

  _onSearchChange = (value: string) => {
    this.setState({ searchQuery: value });
  };

  _getData(exercises, searchQuery, tagSelection) {
    const hasTagsSelected = !!Object.values(tagSelection).find(t => t === true);
    if (!searchQuery && !hasTagsSelected) {
      return exercises;
    }
    return this._getFilterData(
      exercises,
      searchQuery,
      tagSelection,
      hasTagsSelected
    );
  }

  _getFilterData(exercises, searchQuery, tagSelection, hasTagsSelected) {
    return exercises.filter(e => {
      const exerciseName = getExerciseName(e.id, e.name);
      let matchesTags = false;

      if (hasTagsSelected) {
        for (let i = 0; i < e.primary.length; i++) {
          if (tagSelection[mapCategories[e.primary[i]]]) {
            matchesTags = true;
          }
        }

        if (!matchesTags) {
          return false;
        }

        if (matchesTags && !searchQuery) {
          return true;
        }
      }

      return searchExerciseByName(searchQuery, exerciseName);
    });
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };

  _renderHeader = () => {
    const { day } = this.props.route.params;
    return (
      <View>
        <ExerciseHeader day={day} style={styles.header} />
        <ChipsCategory
          items={mainCategories}
          selection={this.state.tagSelection}
          onSelect={this._onSelectCategory}
        />
      </View>
    );
  };

  _onAddExercise = () => {
    this.props.navigation.navigate('EditExercise');
  };

  render() {
    const {
      exercises,
      recentExercises,
      searchQuery,
      tagSelection,
    } = this.state;
    const {
      theme: { colors },
    } = this.props;

    return (
      <Screen>
        <View style={styles.searchToolbar}>
          <Searchbar
            style={[styles.searchBar]}
            onChangeText={this._onSearchChange}
            placeholder={i18n.t('search')}
            icon={Platform.OS === 'android' ? 'arrow-left' : 'magnify'}
            value={searchQuery}
            onIconPress={Platform.OS === 'android' ? this._goBack : undefined}
            theme={{ colors: { primary: colors.textSelection } }}
            testID="searchExercisesBar"
          />
          {Platform.OS === 'android' && (
            <IconButton
              onPress={this._onAddExercise}
              icon="plus"
              style={styles.clearAndroid}
            />
          )}
        </View>
        <SectionList
          testID="exercisesList"
          sections={[
            {
              title: i18n.t('recent'),
              data: this._getData(recentExercises, searchQuery, tagSelection),
            },
            {
              title: i18n.t('exercises'),
              data: this._getData(exercises, searchQuery, tagSelection),
            },
          ]}
          renderSectionHeader={this._renderSectionHeader}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderHeader}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={() => {
            // RN issue on Android https://github.com/facebook/react-native/issues/23364
            Platform.OS === 'android' && Keyboard.dismiss();
          }}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchToolbar: {
    marginHorizontal: 8,
    ...Platform.select({
      android: {
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
      },
      ios: { marginTop: 4 },
    }),
  },
  searchBar: {
    elevation: 0,
    paddingHorizontal: 4,
    ...Platform.select({
      ios: { height: 44 },
      android: { flex: 1, height: 48, paddingRight: 42 },
    }),
  },
  clearAndroid: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  list: {
    paddingTop: 4,
  },
  sectionHeaderContent: {
    height: 48,
    justifyContent: 'center',
  },
  sectionHeaderText: {
    paddingHorizontal: 16,
  },
});

export default withTheme(ExercisesScreen);
