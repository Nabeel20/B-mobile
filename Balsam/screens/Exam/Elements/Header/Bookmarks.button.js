import React from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Colors, ThemeContext} from '../../../Theme';

export default function BookmarksButton({status, onPress}) {
  const {Theme} = React.useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: status ? Colors.blue_light : Theme.grey.default,
        },
      ]}
      onPress={onPress}>
      <Image
        source={
          status
            ? require('../../../../assets/bookmarkIconFill.png')
            : require('../../../../assets/bookmarkIcon.png')
        }
        style={[styles.image, {tintColor: status ? Colors.blue : Theme.text}]}
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    padding: 5,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 24,
    height: 24,
  },
});
