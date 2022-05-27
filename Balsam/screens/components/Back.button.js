import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ThemeContext } from '../Theme';

export default function BackButton({ onPress, _style = {} }) {
  const { Theme } = React.useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: Theme.grey.default,
          borderColor: Theme.grey.default,
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
    borderRadius: 10,
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    padding: 8,
  },
  image: {
    width: 24,
    height: 24,
    transform: [{ scaleX: -1 }],
  },
});
