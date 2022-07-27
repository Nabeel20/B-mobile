import React from 'react';
import {StyleSheet, Animated} from 'react-native';
import {Colors, ThemeContext} from '../../Theme';

export default function ExamButton({
  correctChoice = false,
  textAnimation,
  selectedChoiceChecked = false,
  text,
  large = false,
  choiceSelected,
  onPress,
}) {
  const {Theme, Text, Button} = React.useContext(ThemeContext);
  if (textAnimation === undefined) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    textAnimation = React.useRef(new Animated.Value(100)).current;
  }

  const Status = () => {
    if (!selectedChoiceChecked) {
      return null;
    }
    return (
      <Text style={{color: correctChoice ? Colors.green : Colors.red}}>
        {correctChoice ? 'إجابة صحيحة' : 'إجابة خاطئة'}
      </Text>
    );
  };

  return (
    <Button
      onPress={onPress}
      // eslint-disable-next-line react-native/no-inline-styles
      style={[styles.button, {flex: large ? 3 : 1, marginLeft: large ? 4 : 8}]}>
      <Animated.Text
        style={[
          styles.text,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            color: choiceSelected ? Colors.blue : Theme.text,
            fontFamily: large ? 'ReadexPro-Medium' : 'ReadexPro-Regular',
            opacity: textAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 1],
            }),
          },
        ]}>
        <Status /> {text}
      </Animated.Text>
    </Button>
  );
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    margin: 8,
  },
});
