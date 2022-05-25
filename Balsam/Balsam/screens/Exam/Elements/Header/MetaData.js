import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {ThemeContext} from '../../../Theme';

export default function MetaData({title, subject}) {
  const {Theme} = React.useContext(ThemeContext);
  return (
    <Text>
      <Text
        style={[
          styles.subject,
          {
            color: Theme.grey.accent_2,
          },
        ]}>
        {subject}
      </Text>
      {'\n'}
      <Text
        style={[
          styles.title,
          {
            color: Theme.text,
          },
        ]}>
        {title}
      </Text>
    </Text>
  );
}
const styles = StyleSheet.create({
  subject: {
    fontSize: 12,
    fontFamily: 'Readex pro',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Readex pro',
  },
});
