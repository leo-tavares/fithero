/* @flow */

import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph, Caption, Title } from 'react-native-paper';
import { exercises } from 'fithero-exercises';
import memoize from 'lodash/memoize';

import {
  deleteExercise,
  getExerciseById,
  isCustomExercise,
} from '../../database/services/ExerciseService';
import type { ExerciseSchemaType } from '../../database/types';
import { getExerciseMuscleName, getExerciseName } from '../../utils/exercises';
import i18n from '../../utils/i18n';
import HeaderIconButton from '../../components/Header/HeaderIconButton';
import HeaderOverflowButton from '../../components/Header/HeaderOverflowButton';
import DeleteWarningDialog from '../../components/DeleteWarningDialog';
import Screen from '../../components/Screen';
import useRealmResultsHook from '../../hooks/useRealmResultsHook';
import type { NavigationType } from '../../types';

const getExercise = memoize(id => exercises.find(e => e.id === id));

type Props = {
  navigation: NavigationType,
  route: {
    params: {
      id: string,
      editAction: () => void,
      deleteAction: (i: number) => void,
    },
  },
};

const ExerciseDetailsScreen = (props: Props) => {
  const { navigation } = props;
  const { params = {} } = props.route;
  const id = params.id;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isCustomExercise(params.id) ? (
          <View style={styles.header}>
            <HeaderIconButton
              onPress={() =>
                navigation.navigate('EditExercise', {
                  id,
                })
              }
              icon={Platform.OS === 'ios' ? 'edit' : 'pencil'}
            />
            <HeaderOverflowButton
              onPress={() => setShowDeleteDialog(true)}
              actions={[i18n.t('delete')]}
              destructiveButtonIndex={1}
              last
            />
          </View>
        ) : undefined, // eslint-disable-line prettier/prettier
    });
  }, [id, navigation, params]);

  useEffect(() => {
    if (isDeleting) {
      deleteExercise(id);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isDeleting]);

  const { data: customExercises } = useRealmResultsHook<ExerciseSchemaType>({
    query: useCallback(() => {
      if (isCustomExercise(id)) {
        return getExerciseById(id);
      }
    }, [id]),
  });

  const exercise =
    customExercises.length > 0 ? customExercises[0] : getExercise(id);

  if (isDeleting) {
    return null;
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView>
        <React.Fragment>
          <Title style={styles.section}>
            {getExerciseName(exercise.id, exercise.name)}
          </Title>
          {exercise.notes ? (
            <Paragraph style={styles.section}>{exercise.notes}</Paragraph>
          ) : null}
          <View style={styles.section}>
            <Caption style={styles.smallSubheading}>
              {i18n.t('primary_muscle')}
            </Caption>
            <Paragraph>
              {exercise.primary.map(m => getExerciseMuscleName(m)).join(', ')}
            </Paragraph>
          </View>
          {exercise.secondary.length > 0 && (
            <View style={styles.section}>
              <Caption style={styles.smallSubheading}>
                {i18n.t('secondary_muscle', {
                  count: exercise.secondary.length,
                })}
              </Caption>
              <Paragraph>
                {exercise.secondary
                  .map(m => getExerciseMuscleName(m))
                  .join(', ')}
              </Paragraph>
            </View>
          )}
          <DeleteWarningDialog
            title={i18n.t('delete__exercise_title')}
            description={i18n.t('delete__exercise_description')}
            onConfirm={() => setIsDeleting(true)}
            onDismiss={() => setShowDeleteDialog(false)}
            visible={showDeleteDialog}
          />
        </React.Fragment>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  section: {
    paddingBottom: 16,
  },
  smallSubheading: {
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
  },
});

export default ExerciseDetailsScreen;
