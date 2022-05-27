import React from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';
import {ThemeContext} from '../../../Theme';
import BookmarksIcon from '../../../../assets/bookmarkIcon.png';

export default function BookmarksButton({id}) {
  const {Theme} = React.useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: Theme.grey.default,
        },
      ]}
      onPress={() => console.log(id)}>
      <Image
        source={{uri: BookmarksIcon}}
        style={[styles.image, {tintColor: Theme.text}]}
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