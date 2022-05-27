import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Animated} from 'react-native';
import {Colors, defaultButtonStyle, ThemeContext} from '../../Theme';

export default function ExamButton({
  isCorrect = false,
  onPress,
  textAnimation,
  isChecked = false,
  text,
  index = 1,
  flex = 1,
  isPrevious = false,
  main = false,
}) {
  const {Theme} = React.useContext(ThemeContext);
  if (textAnimation === undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    textAnimation = React.useRef(new Animated.Value(100)).current;
  }
  if (index === 0) {
    return null;
  }
  const Status = () => {
    if (!isChecked) {
      return null;
    }
    return (
      <Text style={{color: isCorrect ? Colors.green : Colors.red}}>
        {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
      </Text>
    );
  };
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[
        styles.flexContainer,
        {
          backgroundColor: Theme.grey.default,
          borderColor: Theme.grey.default,
          flex,
          marginLeft: isPrevious ? 4 : 8,
        },
      ]}>
      <Animated.Text
        style={[
          styles.text,
          {
            color: Theme.text,
            fontWeight: main ? '600' : '400',
            opacity: textAnimation.interpolate({
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
    fontFamily: 'Readex Pro',
    fontSize: 16,
  },
  flexContainer: {
    ...defaultButtonStyle,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    margin: 8,
  },
});
