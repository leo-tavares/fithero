/* @flow */

import * as React from 'react';
import { Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { defaultTheme, darkTheme } from './utils/theme';

type Props = {
  children: React.Node,
};

const PaperThemeProvider = ({ children }: Props) => {
  const appTheme = useSelector(state => state.settings.appTheme);
  const theme = appTheme === 'default' ? defaultTheme : darkTheme;
  return <Provider theme={theme}>{children}</Provider>;
};

export default PaperThemeProvider;
