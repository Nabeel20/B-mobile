import React from 'react';
import {
  Text as NativeText,
  View as ViewNative,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
const ThemeContext = React.createContext();
const Colors = {
  green: '#10B981',
  green_light: '#bbf7d0',
  red: '#DC2626',
  red_light: '#FECACA',
  blue: '#0284C7',
  blue_light: '#BFDBFE',
};
const fonts = {
  regular: 'ReadexPro-Regular',
  medium: 'ReadexPro-Medium',
};
function ThemeProvider({children}) {
  const [darkTheme, setTheme] = React.useState(false);
  const Theme = {
    background: darkTheme ? '#212121' : '#ffffff',
    text: darkTheme ? '#ffffff' : '#141414',
    grey: {
      default: darkTheme ? '#FFFFFF15' : '#21212115',
      accent_1: darkTheme ? '#FFFFFF40' : '#21212116',
      accent_2: darkTheme ? '#C4C4C4' : '#636363',
    },
  };
  const Text = function ({
    style,
    color = '',
    secondary,
    size = 14,
    children: textChildren,
    weight = 'regular',
  }) {
    return (
      <NativeText
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {
            fontFamily: fonts[weight],
            color:
              Colors[color] === undefined
                ? secondary
                  ? Theme.grey.accent_2
                  : Theme.text
                : Colors[color],
            fontSize: size,
          },
          style,
        ]}>
        {textChildren}
      </NativeText>
    );
  };
  const Button = function ({
    onPress,
    style,
    color = 'grey',
    children: buttonChildren,
    round,
    flex = 1,
  }) {
    const background_colors = {
      blue: Colors.blue_light,
      red: Colors.red_light,
      grey: Theme.grey.default,
      'grey-light': Theme.grey.accent_1,
      'grey-dark': Theme.grey.accent_2,
    };
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: background_colors[color],
            borderRadius: round ? 99 : 8,
            flex,
          },
          styles.default_button,
          style,
        ]}>
        {buttonChildren}
      </TouchableOpacity>
    );
  };
  const View = function ({style, children: viewChildren}) {
    return (
      <ViewNative
        style={[
          // eslint-disable-next-line react-native/no-inline-styles
          {backgroundColor: Theme.background},
          style,
        ]}>
        {viewChildren}
      </ViewNative>
    );
  };
  const value = {
    Theme,
    darkTheme,
    setTheme,
    Text,
    Button,
    View,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
const styles = StyleSheet.create({
  default_button: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
});
export {ThemeContext, ThemeProvider, Colors};
