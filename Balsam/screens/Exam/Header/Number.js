import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {Colors} from '../../Theme';

export default function QuestionNumber({
  index,
  animation,
  direction,
  rtl,
  total,
}) {
  const animation_array = React.useRef([
    [20, 0],
    [-20, 0],
  ]);

  React.useEffect(() => {
    if (rtl) {
      animation_array.current = animation_array.current.reverse();
    }
  }, [rtl]);

  return (
    <View style={styles.number_container}>
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 100],
                  outputRange:
                    direction === 'right'
                      ? animation_array.current[0]
                      : animation_array.current[1],
                }),
              },
            ],
            opacity: animation.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 1],
            }),
          },
        ]}>
        {index} / {total}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  number_container: {
    width: 64,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue_light,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: Colors.blue,
    fontFamily: 'ReadexPro-Medium',
    textAlign: 'center',
    fontSize: 16,
  },
});
