import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {ThemeContext} from '../../../Theme';

export default function PreviousButton({index, onPress}) {
  const {Theme} = React.useContext(ThemeContext);
  if (index === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: Theme.grey.default,
          backgroundColor: Theme.grey.default,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: Theme.text,
          },
        ]}>
        السؤال {'\n'}
        السـابق
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    marginLeft: 0,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomWidth: 2,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Readex pro',
  },
});
