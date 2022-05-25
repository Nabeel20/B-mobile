import React from 'react';
import {TouchableOpacity, Text, Animated, View, StyleSheet} from 'react-native';
import {ThemeContext, Colors} from '../Theme';

export default function Choice({
  data,
  prefix,
  selectedChoice,
  validation,
  userInput,
  review,
  correctAnswer,
  handlePress,
  dir,
}) {
  const prefixes = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
  };
  let correct = review && data === correctAnswer;
  let wrong = review && data === userInput;
  let chosen = !validation && data === selectedChoice;
  const {Theme} = React.useContext(ThemeContext);
  const [border_color, set_border_color] = React.useState(Theme.grey.accent_1);

  // React.useEffect(() => {
  //   //  console.log({ prefix, review, data, validation, selectedChoice, userInput, correctAnswer })
  //   let correct = review && data === correctAnswer;
  //   let wrong = review && data === userInput;
  //   let chosen = !validation && data === selectedChoice;
  //   if (correct) return set_border_color(Colors.green);
  //   if (chosen) return set_border_color(Colors.blue);
  //   if (wrong) return set_border_color(Colors.red)
  //   set_border_color(Theme.grey.default)
  //   //review, data, validation, selectedChoice, userInput, correctAnswer
  // }, [review, data, validation, selectedChoice, userInput, correctAnswer])
  return (
    <TouchableOpacity onPress={() => handlePress(data)}>
      <View
        style={[
          styles.container,
          {
            flexDirection: dir ? 'row-reverse' : 'row',
            backgroundColor: Theme.grey.default,
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
          <Animated.Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              textAlign: 'center',
              color: chosen
                ? Colors.blue
                : correct
                ? Colors.green
                : wrong
                ? Colors.red
                : Theme.grey.accent_2,
            }}>
            {prefixes[prefix]}
          </Animated.Text>
        </View>
        <Text
          style={[
            styles.text,
            {
              color: Theme.text,
            },
          ]}>
          {data}
        </Text>
      </View>
    </TouchableOpacity>
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
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    marginHorizontal: 8,
    fontFamily: 'Readex pro',
    fontWeight: '500',
  },
});
