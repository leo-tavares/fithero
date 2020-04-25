/* @flow */
/* eslint-disable camelcase */

import { type ____DangerouslyImpreciseStyleProp_Internal } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

// Shared types
export type StylePropType = ____DangerouslyImpreciseStyleProp_Internal;

export type NavigateType = (
  route: string,
  params?: { [key: string]: mixed }
) => void;

export type NavigationType = {
  push: (route: string, params?: { [key: string]: mixed }) => void,
  navigate: NavigateType,
  goBack: (routeKey?: ?string) => boolean,
  dispatch: (() => void) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  setOptions: Object => void,
};

export type DispatchType<T> = {
  type: string,
  payload: T,
};

export type CategoryType = {|
  id: string,
  name: string,
|};

export interface RealmResults<T> extends Array<T> {
  addListener: (
    fn: (
      data: RealmResults<T>,
      changes: {
        insertions: number[],
        modifications: number[],
        deletions: number[],
      }
    ) => void
  ) => void;
  removeAllListeners: () => void;
}
