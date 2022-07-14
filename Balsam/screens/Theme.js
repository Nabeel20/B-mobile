import React from 'react';
import {
  Text as NativeText,
  View as ViewNative,
  TouchableOpacity,
} from 'react-native';
const ThemeContext = React.createContext();
const Colors = {
  green: '#10B981',
  green_light: '#bbf7d0', //"#A7F3D0",
  red: '#DC2626',
  red_light: '#FECACA',
  blue: '#0284C7',
  blue_light: '#BFDBFE',
};

const ButtonStyle = {
  padding: 14,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 4,
};
const ButtonStyleText = {
  fontSize: 16,
  fontFamily: 'Readex pro',
  fontWeight: 600,
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
    padding,
    textChildren,
  }) {
    return (
      <NativeText
        style={[
          {
            fontFamily: 'Readex pro',
            color:
              Colors[color] === undefined
                ? secondary
                  ? Theme.grey.accent_2
                  : Theme.text
                : Colors[color],
            fontSize: size,
            padding: padding === undefined ? null : padding,
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
    color,
    buttonChildren,
    round,
    flex,
  }) {
    const background_colors = {
      blue: Colors.blue_light,
      red: Colors.red_light,
    };
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            backgroundColor:
              Colors[color] === undefined
                ? Theme.grey.default
                : background_colors[color],
            borderRadius: round ? 99 : 8,
            flex: flex === undefined ? null : 1,
            ...ButtonStyle,
          },
          style,
        ]}>
        {buttonChildren}
      </TouchableOpacity>
    );
  };
  const View = function ({background = false, style, viewChildren}) {
    return (
      <ViewNative
        style={[
          {backgroundColor: background ? Theme.background : null},
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

export {ThemeContext, ThemeProvider, Colors, ButtonStyle, ButtonStyleText};
