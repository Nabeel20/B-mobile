import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Progress from './Progress';
import Spacer from '../Spacer';
import QuestionNumber from './QuestionNumber';
import BookmarksButton from './Bookmarks.button';
import BackButton from '../../../components/Back.button';
import {Colors, ThemeContext} from '../../../Theme';

export default function Header({details, onNavigation, onClose, onBookmark}) {
  const {
    title,
    subject,
    rtl,
    total_num,
    exit_point,
    progress_step,
    index,
    animation,
    direction,
    bookmark_status,
    time,
  } = details;
  const {Theme} = React.useContext(ThemeContext);
  return (
    <>
      <View style={styles.headerContainer}>
        <BackButton onPress={onNavigation} />
        <View
          style={[styles.header, {flexDirection: rtl ? 'row-reverse' : 'row'}]}>
          {exit_point ? (
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>الانتقال للنتيجة</Text>
            </TouchableOpacity>
          ) : (
            <Text>
              <Text
                style={[
                  styles.quiz_subject,
                  {
                    color: Theme.grey.accent_2,
                  },
                ]}>
                {subject}
              </Text>
              {'\n'}
              <Text
                style={[
                  styles.quiz_title,
                  {
                    color: Theme.text,
                  },
                ]}>
                {title}
              </Text>
            </Text>
          )}
          <Text
            style={[
              styles.timerText,
              {
                color: Theme.text,
              },
            ]}>
            <Text>{time}</Text> {time >= 3 ? 'دقائق' : 'دقيقة'}
          </Text>
        </View>
      </View>
      <Progress dir={rtl} step={progress_step} />
      <Spacer vertical={10} />

      <View style={[styles.row, {flexDirection: rtl ? 'row-reverse' : 'row'}]}>
        <QuestionNumber
          total={total_num}
          animation={animation}
          direction={direction}
          number={index + 1}
          RTL={rtl}
        />
        <BookmarksButton status={bookmark_status} onPress={onBookmark} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 10,
    padding: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red_light,
  },
  buttonText: {
    fontFamily: 'ReadexPro-Regular',
    fontSize: 14,
    color: '#212121',
  },
  quiz_subject: {
    fontSize: 12,
    fontFamily: 'ReadexPro-Regular',
  },
  quiz_title: {
    fontSize: 14,
    fontFamily: 'ReadexPro-Bold',
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'ReadexPro-Regular',
  },
});
