import React from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {Colors, ThemeContext} from '../../Theme';

export default function Progress({step, rtl}) {
  const loaderValue = React.useRef(new Animated.Value(0)).current;
  const {Theme} = React.useContext(ThemeContext);

  const load = percent => {
    Animated.timing(loaderValue, {
      toValue: percent,
      duration: 300,
      delays: 500,
      useNativeDriver: true,
    }).start();
  };
  React.useEffect(() => {
    load(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Theme.grey.accent_1,
          transform: [{scaleX: rtl ? -1 : 1}],
        },
      ]}>
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: Colors.green,
            width: loaderValue.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 8,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    flowDirection: 'row',
  },
  progress: {
    height: 8,
    borderRadius: 10,
    width: '100%',
    ...StyleSheet.absoluteFill,
  },
});
