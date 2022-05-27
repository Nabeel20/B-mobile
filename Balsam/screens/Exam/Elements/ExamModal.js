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
import { ThemeContext, Colors } from '../../Theme';

function Button({ onPress, blue = false, text, theme }) {
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
function Details({ noInput, Theme, type, data }) {
  const { skipped_num, correct_num, total_num, progress, time } = data;
  if (noInput) {
    return (
      <Text
        style={[
          styles.text,
          {
            color: Theme.grey.accent_2,
          },
        ]}>
        لم تجب على أي من الأسئلة
      </Text>
    );
  }
  if (type === 'skip') {
    return (
      <Text
        style={[
          styles.text,
          {
            color: Theme.grey.accent_2,
          },
        ]}>{`تجاوزت ${skipped_num} ${skipped_num < 3 ? 'سؤال' : 'أسئلة'
          } يمكنك حل الأسئلة المتبقية أو الانتقال مباشرة إلى النتائج`}</Text>
    );
  }

  return (
    <View>
      <Text
        style={[
          styles.text,
          {
            color: Theme.grey.accent_2,
          },
        ]}>
        {`${correct_num} ${correct_num < 3 ? 'جواب صحيح' : 'أجوبة صحيحة'
          } من أصل  ${total_num} (${Math.ceil(progress)}%)`}{' '}
        • {`${time} `}
        {time >= 3 ? 'دقائق' : 'دقيقة'}
      </Text>

      {skipped_num !== 0 ? (
        <Text
          style={[
            styles.text,
            {
              color: Theme.grey.accent_2,
            },
          ]}>
          {`تجاوزت ${skipped_num} `}
          {skipped_num < 3 ? 'سؤال' : 'أسئلة'}
        </Text>
      ) : null}
    </View>
  );
}
export default function ExamModal({
  visible,
  type,
  details,
  onPressPrimary,
  onPressSecondary,
}) {
  const { Theme } = React.useContext(ThemeContext);
  const animation = React.useRef(new Animated.Value(0)).current;
  const {
    title,
    subject,
    correct_num,
    total_num,
    skipped_num,
    progress,
    no_input,
    time,
  } = details;
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
    return () => {
      animation.setValue(0);
    };
  }, [type]);
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
          <View style={styles.meta}>
            <MetaData title={title} subject={subject} />
          </View>
          <View style={styles.header}>
            <Image source={require('../../../assets/celebration.icon.png')} style={styles.image} />
            <Text
              style={[
                styles.title,
                {
                  color: type === 'skip' ? Colors.green : Colors.blue,
                },
              ]}>
              {type == 'skip' ? 'الخطوة التالية؟' : 'الله يعطيك العافية'}
            </Text>

            <Details
              Theme={Theme}
              type={type}
              noInput={no_input}
              data={{ skipped_num, correct_num, total_num, progress, time }}
            />
          </View>
        </Animated.View>

        <View>
          <Button
            onPress={onPressPrimary}
            blue
            text={type === 'skip' ? 'حل باقي الأسئلة' : 'مراجعة الأسئلة'}
            theme={Theme}
          />
          <Button
            onPress={onPressSecondary}
            text={type === 'skip' ? 'الانتقال للنتيجة' : 'عودة'}
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
    justifyContent: 'space-between',
  },
  meta: {
    alignSelf: 'flex-end',
  },
  title: {
    color: Colors.blue,
    fontSize: 45,
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
  green: {
    color: Colors.green,
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
    justifyContent: 'space-evenly',
    flex: 1,
  },
});
