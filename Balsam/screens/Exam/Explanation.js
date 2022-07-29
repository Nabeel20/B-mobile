import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {ThemeContext} from '../Theme';

export default function Explanation({rtl, children, animation}) {
  const {Theme, Text} = React.useContext(ThemeContext);
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 100],
                outputRange: [20, 0],
              }),
            },
          ],
          opacity: animation.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
          }),
        },
      ]}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.divider, {flexDirection: rtl ? 'row' : 'row-reverse'}]}>
        <Text color="grey-dark" weight="medium">
          {rtl ? 'التوضيح' : 'Explanation'}
        </Text>
        <View style={[styles.line, {backgroundColor: Theme.grey.default}]} />
      </View>
      <Text style={styles.explanation}>{children}</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  explanation: {
    fontSize: 16,
    margin: 8,
  },
  container: {
    alignItems: 'center',
  },
  divider: {
    alignItems: 'center',
  },
  line: {
    height: 3,
    flex: 1,
    marginHorizontal: 8,
  },
});
