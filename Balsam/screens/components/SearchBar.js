import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {ThemeContext} from '../Theme';

function SearchBar({onText, onFocus, autoFocus = true}) {
  const textInput_ref = React.useRef(null).current;
  const {Theme} = React.useContext(ThemeContext);

  function handle_focus() {
    if (onFocus === undefined) {
      return;
    }
    onFocus();
  }
  return (
    <TextInput
      ref={textInput_ref}
      style={[
        styles.searchBar,
        {
          backgroundColor: Theme.grey.default,
          color: Theme.grey.accent_2,
          borderColor: Theme.grey.accent_1,
          transform: [],
        },
      ]}
      maxLength={40}
      autoFocus={autoFocus}
      placeholder="...البحث في الملفات"
      placeholderTextColor={Theme.grey.accent_2}
      onChangeText={text => {
        onText(text);
      }}
      onFocus={handle_focus}
    />
  );
}
const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    fontSize: 14,
    textAlign: 'right',
    fontFamily: 'ReadexPro-Regular',
  },
});
export default SearchBar;
