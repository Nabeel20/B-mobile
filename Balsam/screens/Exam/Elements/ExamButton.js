import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Animated} from 'react-native';
import {Colors, ThemeContext} from '../../Theme';

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
  onChoose = false,
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
          flex,
          marginLeft: isPrevious ? 4 : 8,
        },
      ]}>
      <Animated.Text
        style={[
          styles.text,
          {
            color: onChoose ? Colors.blue : Theme.text,
            fontFamily: main ? 'ReadexPro-Medium' : 'ReadexPro-Regular',
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
    fontSize: 16,
  },
  flexContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    margin: 8,
  },
});
