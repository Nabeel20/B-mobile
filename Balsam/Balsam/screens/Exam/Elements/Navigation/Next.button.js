import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Animated} from 'react-native';
import {Colors, ThemeContext} from '../../../Theme';

export default function NextButton({
  correct,
  handlePress,
  animation,
  checked,
  text,
}) {
  const {Theme} = React.useContext(ThemeContext);

  const Status = () => {
    if (!checked) {
      return null;
    }
    return (
      <Text style={{color: correct ? Colors.green : Colors.red}}>
        {correct ? 'إجابة صحيحة' : 'إجابة خاطئة'}
      </Text>
    );
  };
  return (
    <TouchableOpacity
      onPress={() => handlePress()}
      style={[
        styles.flexContainer,
        {
          backgroundColor: Theme.grey.default,
          borderColor: Theme.grey.default,
        },
      ]}>
      <Animated.Text
        style={[
          styles.text,
          {
            color: Theme.text,
            opacity: animation.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 1],
            }),
          },
        ]}>
        <Status /> {text}
      </Animated.Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontFamily: 'ReadexPro-Bold',
    fontSize: 16,
  },
  flexContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    margin: 8,
    flex: 3,
    borderBottomWidth: 2,
  },
});
