import React from 'react';
const ThemeContext = React.createContext();
const Colors = {
  green: '#10B981',
  green_light: '#bbf7d0',
  red: '#DC2626',
  red_light: '#FECACA',
  blue: '#0284C7',
  blue_light: '#BFDBFE',
};
const defaultButtonStyle = {
  borderRadius: 10,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  borderBottomWidth: 2,
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
  const value = {
    Theme,
    darkTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export {ThemeContext, ThemeProvider, Colors, defaultButtonStyle};
