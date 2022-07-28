import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {Colors} from '../../Theme';

export default function QuestionNumber({
  number,
  animation,
  direction,
  RTL,
  total,
}) {
  const animationArray = React.useRef([
    [20, 0],
    [-20, 0],
  ]);

  React.useEffect(() => {
    if (RTL) {
      animationArray.current = animationArray.current.reverse();
    }
  }, [RTL]);

  return (
    <View style={styles.numberContainer}>
      <Animated.Text
        style={[
          styles.numberText,
          {
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 100],
                  outputRange:
                    direction === 'right'
                      ? animationArray.current[0]
                      : animationArray.current[1],
                }),
              },
            ],
            opacity: animation.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 1],
            }),
          },
        ]}>
        {number} / {total}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  numberContainer: {
    width: 32 * 2,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: Colors.blue_light,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  numberText: {
    color: Colors.blue,
    fontFamily: 'ReadexPro-Medium',
    textAlign: 'center',
    fontSize: 16,
  },
});
