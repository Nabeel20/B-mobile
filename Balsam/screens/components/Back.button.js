import React from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';
import {defaultButtonStyle, ThemeContext} from '../Theme';

export default function BackButton({onPress, _style = {}}) {
  const {Theme} = React.useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: Theme.grey.default,
          borderColor: Theme.grey.accent_2,
        },
        _style,
      ]}>
      <Image
        source={require('../../assets/arrow.png')}
        style={[
          styles.image,
          {
            tintColor: Theme.text,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    ...defaultButtonStyle,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    padding: 8,
  },
  image: {
    width: 24,
    height: 24,
    transform: [{scaleX: -1}],
  },
});
