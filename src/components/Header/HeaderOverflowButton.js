/* @flow */

import * as React from 'react';
import {
  UIManager,
  findNodeHandle,
  ActionSheetIOS,
  Platform,
} from 'react-native';

import HeaderIconButton from './HeaderIconButton';
import i18n from '../../utils/i18n';

export type HeaderOverflowButtonProps = {|
  actions: Array<string>,
  destructiveButtonIndex?: number,
  last?: boolean,
|};

type Props = {|
  ...HeaderOverflowButtonProps,
  onPress: (index: number) => mixed,
|};

class HeaderOverflowButton extends React.Component<Props> {
  menuRef: ?HeaderIconButton;

  _onPress = () => {
    if (Platform.OS === 'android') {
      UIManager.showPopupMenu(
        findNodeHandle(this.menuRef),
        this.props.actions,
        () => {},
        (action, index) => {
          if (action === 'itemSelected') {
            // $FlowFixMe
            this.props.onPress(index);
          }
        }
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [i18n.t('cancel'), ...this.props.actions],
          destructiveButtonIndex: this.props.destructiveButtonIndex,
          cancelButtonIndex: 0,
        },
        index => {
          if (index > 0) {
            // To make it same index as Android, as we do not care about Cancel action
            this.props.onPress(index - 1);
          }
        }
      );
    }
  };
  render() {
    return (
      <HeaderIconButton
        ref={r => {
          this.menuRef = r;
        }}
        onPress={this._onPress}
        icon={Platform.OS === 'ios' ? 'more-horiz' : 'dots-vertical'}
        last={this.props.last}
      />
    );
  }
}

export default HeaderOverflowButton;
