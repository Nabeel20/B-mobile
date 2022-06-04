import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import MetaData from './Header/MetaData';
import {ThemeContext, Colors} from '../../Theme';

function Button({onPress, blue = false, text, theme}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: blue ? Colors.blue_light : theme.grey.default,
        },
      ]}>
      <Text
        style={[
          styles.buttonText,
          {
            color: blue ? Colors.blue : theme.text,
          },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
function Details({
  onSkip,
  noInput,
  skippedNum,
  totalNum,
  time,
  correctNum,
  Theme,
}) {
  if (noInput) {
    return (
      <Text
        style={[
          styles.helper_text,
          styles.center_text,
          {color: Theme.grey.accent_2},
        ]}>
        لم تحل أي من الأسئلة :/
      </Text>
    );
  }
  if (onSkip) {
    return (
      <Text
        style={[
          styles.helper_text,
          styles.center_text,
          {color: Theme.grey.accent_2},
        ]}>
        تجاوزت {skippedNum} سؤال
      </Text>
    );
  }

  return (
    <View style={styles.score_container}>
      <Text style={[styles.score_text, {color: Theme.text}]}>
        النتائج {' \n '}
        <Text style={[styles.helper_text, {color: Theme.grey.accent_2}]}>
          من أصل {totalNum}
        </Text>
      </Text>
      <View style={styles.cards_container}>
        <View style={[styles.card, styles.green_background]}>
          <Text style={[styles.score_text, styles.green_text]}>
            {correctNum}
          </Text>
          <Text style={[styles.helper_text, styles.green_text]}>صح</Text>
        </View>
        <View style={[styles.card, styles.red_background]}>
          <Text style={[styles.score_text, styles.red_text]}>
            {totalNum - Math.abs(skippedNum - correctNum)}
          </Text>
          <Text style={[styles.helper_text, styles.red_text]}>خطأ</Text>
        </View>
        <View style={[styles.card, styles.blue_background]}>
          <Text style={[styles.score_text, styles.blue_text]}>{time}</Text>
          <Text style={[styles.helper_text, styles.blue_text]}>دقيقة</Text>
        </View>
      </View>
      {skippedNum > 0 ? (
        <Text
          style={[
            styles.helper_text,
            styles.skip_warning,
            {color: Theme.grey.accent_2},
          ]}>
          تجاوزت {skippedNum} سؤال
        </Text>
      ) : null}
    </View>
  );
}
export default function ExamModal({
  visible,
  onSkip,
  details,
  onPressPrimary,
  onPressSecondary,
}) {
  const {Theme} = React.useContext(ThemeContext);
  const animation = React.useRef(new Animated.Value(0)).current;
  const {title, subject, correct_num, total_num, skipped_num, no_input, time} =
    details;
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
    return () => {
      animation.setValue(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSkip]);
  return (
    <Modal animationType="slide" visible={visible}>
      <View
        style={[
          styles.modal,
          {
            backgroundColor: Theme.background,
          },
        ]}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: animation.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 100],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.spacer} />
          <View style={styles.meta}>
            <MetaData title={title} subject={subject} />
          </View>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={styles.header}>
            <Image
              source={
                onSkip
                  ? require('../../../assets/thinking.png')
                  : no_input
                  ? require('../../../assets/no_input.png')
                  : require('../../../assets/celebration.png')
              }
              style={styles.image}
            />
            <Text
              style={[
                styles.title,
                {
                  color: onSkip ? Colors.green : Colors.blue,
                },
              ]}>
              {onSkip ? 'الخطوة التالية؟' : 'الله يعطيك العافية'}
            </Text>
          </View>
          <Details
            correctNum={correct_num}
            skippedNum={skipped_num}
            totalNum={total_num}
            noInput={no_input}
            time={time}
            onSkip={onSkip}
            Theme={Theme}
          />
        </Animated.View>

        <View>
          <Button
            onPress={onPressPrimary}
            blue
            text={onSkip ? 'حل باقي الأسئلة' : 'مراجعة الأسئلة'}
            theme={Theme}
          />
          <Button
            onPress={onPressSecondary}
            text={onSkip ? 'انتقل للنتيجة' : 'عودة'}
            theme={Theme}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    padding: 24,
  },
  meta: {
    alignSelf: 'flex-end',
  },
  title: {
    color: Colors.blue,
    fontSize: 32,
    fontFamily: 'ReadexPro-Bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  header: {
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: 'ReadexPro-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    margin: 8,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 16,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'ReadexPro-Regular',
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
  score_text: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
    marginBottom: 16,
  },
  card_text: {
    fontFamily: 'ReadexPro-Medium',
    fontSize: 16,
  },
  helper_text: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
  },
  score_container: {
    marginHorizontal: 16,
  },
  cards_container: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-evenly',
  },
  card: {
    width: 60,
    height: 60,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  green_background: {
    backgroundColor: Colors.green_light,
  },
  red_background: {
    backgroundColor: Colors.red_light,
  },
  blue_background: {
    backgroundColor: Colors.blue_light,
  },
  green_text: {
    color: Colors.green,
  },
  red_text: {
    color: Colors.red,
  },
  blue_text: {
    color: Colors.blue,
  },
  skip_warning: {
    marginTop: 16,
    alignSelf: 'center',
  },
  spacer: {
    height: '10%',
  },
  center_text: {
    alignSelf: 'center',
  },
});
