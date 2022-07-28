import React from 'react';
import {Modal, View, StyleSheet, Image} from 'react-native';
import BackButton from '../components/BackButton';
import {ThemeContext} from '../Theme';

export default function ExamModal({
  visible = false,
  details,
  buttons = ['', ''],
  onPress = [],
  exitButton = false,
  onRequestClose,
}) {
  const {Theme, Text, Button} = React.useContext(ThemeContext);
  const ICONS = {
    thinking: require('../../assets/thinking-icon.png'),
    confetti: require('../../assets/confetti-icon.png'),
    noInput: require('../../assets/faceless-icon.png'),
    leaving: require('../../assets/sad-icon.png'),
  };
  const {
    title,
    sub_title,
    correct_answers_number,
    skipped_questions_number,
    questions_number,
    no_user_input,
    icon,
    time,
  } = details;
  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: Theme.background,
          },
        ]}>
        {exitButton ? <BackButton onPress={onRequestClose} /> : null}
        <View style={styles.main}>
          <View style={styles.header}>
            <Image source={ICONS[icon]} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.sub_title} secondary>
              {sub_title}
            </Text>
          </View>
          {questions_number > 0 && no_user_input === false ? (
            <View style={styles.score_container}>
              <Text>النتائج من أصل {questions_number} سؤال</Text>
              <View style={styles.score_title}>
                <Text color="green" style={styles.score_title}>
                  {correct_answers_number}{' '}
                  <Text style={styles.score_subtitle} color="green">
                    صح
                  </Text>
                </Text>
                <View
                  style={[
                    styles.divider,
                    {backgroundColor: Theme.grey.default},
                  ]}
                />
                <Text color="red" style={styles.score_title}>
                  {questions_number -
                    skipped_questions_number -
                    correct_answers_number}{' '}
                  <Text color="red" style={styles.score_subtitle}>
                    خطأ
                  </Text>
                </Text>
              </View>

              <Text>خلال {time} دقيقة</Text>
              {skipped_questions_number > 0 ? (
                <Text secondary>تجاوزت {skipped_questions_number} سؤال</Text>
              ) : null}
            </View>
          ) : null}
          {no_user_input ? (
            <Text secondary>لم تجب على أي من الأسئلة</Text>
          ) : null}
        </View>
        <View style={styles.footer}>
          {buttons.map((btn, index) => {
            return (
              <Button
                key={index}
                onPress={onPress[index]}
                round
                flex
                color={btn.color}>
                <Text color={btn.color} weight="medium" size={16}>
                  {btn.text}
                </Text>
              </Button>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: 72,
    height: 72,
    padding: 8,
  },
  main: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  score_container: {
    marginHorizontal: 8,
  },
  header: {
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Readex Pro',
    fontWeight: 600,
    marginBottom: 8,
  },
  sub_title: {
    fontSize: 16,
    fontFamily: 'Readex Pro',
  },
  divider: {
    height: 2,
    margin: 4,
    borderRadius: 1,
  },
  score_title: {
    fontSize: 40,
  },
  score_subtitle: {
    fontSize: 16,
  },
});
