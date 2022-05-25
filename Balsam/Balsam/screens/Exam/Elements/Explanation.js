import React from 'react';
import {Text, Animated, StyleSheet, View} from 'react-native';
import {ThemeContext} from '../../Theme';
function Divider({rtl, theme}) {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: rtl ? 'row-reverse' : 'row',
        },
      ]}>
      <View
        style={[
          styles.before <
            {
              backgroundColor: theme.grey.accent_1,
            },
        ]}
      />
      <Text
        style={[
          styles.text,
          {
            color: theme.grey.accent_2,
          },
        ]}>
        {rtl ? 'شرح السؤال' : 'Explanation'}
      </Text>
      <View
        style={[
          styles.after,
          {
            backgroundColor: theme.grey.accent_1,
          },
        ]}
      />
    </View>
  );
}
export default function Explanation({rtl, text, animation}) {
  const {Theme} = React.useContext(ThemeContext);
  return (
    <Animated.View
      style={{
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
      }}>
      <Divider rtl={rtl} theme={Theme} />
      <Text
        style={[
          styles.explanation,
          {
            color: Theme.text,
          },
        ]}>
        {text}
      </Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  explanation: {
    fontSize: 16,
    margin: 8,
    fontFamily: 'ReadexPro-Regular',
  },
  container: {
    alignItems: 'center',
  },
  before: {
    height: 4,
    flex: 4,
    margin: 8,
    borderRadius: 10,
  },
  after: {
    height: 4,
    flex: 1,
    margin: 8,
    borderRadius: 10,
  },
  text: {
    fontFamily: 'ReadexPro-Medium',
  },
});
