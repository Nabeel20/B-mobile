import React from 'react';
import {StyleSheet} from 'react-native';
import {ThemeContext, Colors} from '../Theme';

export default function Choice({
  choice,
  prefix,
  selectedChoice,
  isChoiceChecked,
  isQuestionDone,
  correctAnswer,
  onPress,
  rtl,
  userChoice,
}) {
  const prefixes = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
  };
  let correct = isQuestionDone && choice === correctAnswer;
  let wrong = isQuestionDone && choice === userChoice;
  let chosen = isChoiceChecked === false && choice === selectedChoice;
  const {Theme, View, Text, Button} = React.useContext(ThemeContext);
  return (
    <Button
      onPress={() => onPress(choice)}
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flexDirection: rtl ? 'row-reverse' : 'row',
          borderColor: chosen
            ? Colors.blue
            : correct
            ? Colors.green
            : wrong
            ? Colors.red
            : Theme.grey.accent_1,
        },
      ]}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor: chosen
              ? Colors.blue_light
              : correct
              ? Colors.green_light
              : wrong
              ? Colors.red_light
              : Theme.grey.accent_1,
          },
        ]}>
        <Text
          type="medium"
          style={styles.prefix}
          color={
            chosen ? 'blue' : correct ? 'green' : wrong ? 'red' : 'grey-dark'
          }>
          {prefixes[prefix]}
        </Text>
      </View>
      <Text style={styles.text}>{choice}</Text>
    </Button>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  circle: {
    width: 24,
    height: 24,
    padding: 2,
    borderRadius: 24 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    marginHorizontal: 8,
    fontFamily: 'ReadexPro-Medium',
  },
  prefix: {
    textAlign: 'center',
  },
});
